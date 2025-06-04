Excellent — you’re now aiming for a complete **file management system** with:

### ✅ Goals:

1. **Bulk upload entire folder structure** (tv/ssc/2024/\*.cpp etc.)
2. **View + download any individual file**
3. **Edit mode for a file** – user can edit text, save → backend replaces file

Let’s tackle these **one by one** (code for routes + controllers).

---

## 🧱 1. BULK FOLDER UPLOAD

> 🟡 You'll use `<input type="file" webkitdirectory />` in Vue
> ✅ Backend will handle multiple files + folder paths

### ✅ Vue Example for Folder Upload

```html
<input type="file" webkitdirectory directory multiple @change="handleFolderUpload" />
```

```js
const handleFolderUpload = async (e) => {
  const files = e.target.files;
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file); // All files
    formData.append('paths', file.webkitRelativePath); // Custom: capture folder info
  }

  await uploadFolder(formData);
};
```

---

### ✅ Route: `POST /testcases/bulk`

```js
router.post('/testcases/bulk', multer.any(), tcController.bulkUpload);
```

---

### ✅ Controller: `bulkUpload`

```js
exports.bulkUpload = (req, res) => {
  const files = req.files;
  const paths = req.body.paths; // FormData appends same key many times

  if (!files || files.length === 0) return res.status(400).send("No files uploaded");

  const normalizedPaths = Array.isArray(paths) ? paths : [paths];

  const insertPromises = files.map((file, idx) => {
    const relative_path = normalizedPaths[idx]; // e.g. tv/ssc/2024/abc.cpp
    const destPath = path.join(__dirname, '../uploads', relative_path);

    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, fs.readFileSync(file.path)); // Move file

    // Now insert metadata
    const [TC_name] = path.basename(relative_path).split('.');
    const TC_description = "Bulk uploaded";

    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO testcases (TC_name, TC_description, file_path) VALUES (?, ?, ?)";
      db.query(sql, [TC_name, TC_description, path.join('uploads', relative_path)], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  Promise.all(insertPromises)
    .then(() => res.status(201).send("Bulk upload complete"))
    .catch((err) => res.status(500).send(err.message));
};
```

---

## 🔍 2. VIEW & DOWNLOAD FILE

### ✅ Route:

```js
router.get('/testcases/:TC_id/view', tcController.viewFile);
router.get('/testcases/:TC_id/download', tcController.downloadFile);
```

---

### ✅ Controller:

```js
exports.viewFile = (req, res) => {
  const { TC_id } = req.params;

  db.query("SELECT file_path FROM testcases WHERE TC_id = ?", [TC_id], (err, result) => {
    if (err || result.length === 0) return res.status(404).send("Not found");

    const fullPath = result[0].file_path;
    fs.readFile(fullPath, 'utf8', (fsErr, content) => {
      if (fsErr) return res.status(500).send("File read error");
      res.json({ content }); // Send file as plain text
    });
  });
};

exports.downloadFile = (req, res) => {
  const { TC_id } = req.params;

  db.query("SELECT file_path FROM testcases WHERE TC_id = ?", [TC_id], (err, result) => {
    if (err || result.length === 0) return res.status(404).send("Not found");

    const fullPath = result[0].file_path;
    res.download(fullPath);
  });
};
```

---

## 📝 3. EDIT FILE CONTENT (Submit to Update File)

### ✅ Route:

```js
router.put('/testcases/:TC_id/file', tcController.editFileContent);
```

---

### ✅ Controller:

```js
exports.editFileContent = (req, res) => {
  const { TC_id } = req.params;
  const { content } = req.body;

  db.query("SELECT file_path FROM testcases WHERE TC_id = ?", [TC_id], (err, result) => {
    if (err || result.length === 0) return res.status(404).send("Not found");

    const fullPath = result[0].file_path;

    fs.writeFile(fullPath, content, (fsErr) => {
      if (fsErr) return res.status(500).send("Error writing file");
      res.send("File updated successfully");
    });
  });
};
```

---

## ✅ Final Route Summary (All in `tc_routes.js`)

```js
router.post('/testcases', multer.single('file'), tcController.createTestCase);
router.post('/testcases/bulk', multer.any(), tcController.bulkUpload);
router.put('/testcases/:TC_id', multer.single('file'), tcController.editTestCase);
router.put('/testcases/:TC_id/file', tcController.editFileContent);
router.delete('/testcases/:TC_id', tcController.deleteTestCase);
router.get('/testcases/:TC_id/view', tcController.viewFile);
router.get('/testcases/:TC_id/download', tcController.downloadFile);
```

---

## ✅ On the Vue Side

* Use `fetch(`/testcases/\${id}/view`)` → Show file in `<textarea>`
* On submit, PUT `{ content: editedCode }` to `/testcases/:id/file`
* Use `<a :href="`/testcases/\${id}/download`">Download</a>` for download

---

### ✅ All Done ✔️

You now have:

* Full CRUD on test cases with local file storage
* Bulk folder uploads with nested paths
* File view/edit/download capabilities

Would you like the Vue `<TCEditor.vue>` UI next to support view + edit?

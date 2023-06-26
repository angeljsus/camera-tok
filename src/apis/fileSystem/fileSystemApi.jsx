const createImageFileByBase = (base, pathFolder, stringName, ext) => {
  return Promise.resolve(fs.ensureDirSync(pathFolder))
    .then(() => {
      const extension = ext.replace('.', '');
      const clean = base.replace(/^data:image\/png;base64,/, '');
      return new Promise((resolve, reject) => {
        const name = `${stringName}.${extension}`;
        const filePath = `${pathFolder}${name}`;
        fs.writeFile(filePath, clean, { encoding: 'base64' }, (err) => {
          err ? reject(err) : resolve({ path: filePath, name: name });
        });
      });
    })
}

const deleteFile = (pathFolder, fileName, ext) => {
  const extension = ext.replace('.', '');
	const pathFile = path.join(pathFolder, fileName) + '.' + extension;
	return fs.remove(pathFile)
  .then( () => {
    return { deleted: true, path: pathFile, name: fileName};
  })
}

export { 
  createImageFileByBase,
  deleteFile,
};
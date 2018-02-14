import fs from 'fs';
import path from 'path';
import pathIsAbsolute from 'path-is-absolute';

import { renderString } from 'template-file';

function getDynamicFilename(file, data) {
  return file.replace(/__[A-Za-z0-9-]+__/g, (match) => {
    const dataKey = match.substring(2, match.length - 2);
    const dataVal = data[dataKey];

    if (dataVal) {
      return dataVal;
    }
    return match;
  });
}

const templateDir = ({ source = '', destination = 'destination', onlyFiles = false, exclude = [] } = {}, data = {}) => {
  const cwd = process.cwd();

  const thisSource = pathIsAbsolute(source) ? source : path.join(cwd, source);
  const thisDestination = pathIsAbsolute(destination) ? destination : path.join(cwd, destination);
  const thisOnlyFiles = onlyFiles;
  const thisExclude = exclude;


  try {
    const listOfFiles = fs.readdirSync(thisSource);
    const destinationExists = fs.existsSync(thisDestination);

    if (!destinationExists) {
      fs.mkdirSync(thisDestination);
    }

    listOfFiles.forEach((file) => {
      const thisFile = path.join(thisSource, file);
      const stat = fs.statSync(thisFile);
      const destinationFilename = getDynamicFilename(file, data);
      const destinationPath = path.join(thisDestination, destinationFilename);

      if (stat && stat.isDirectory() && !thisOnlyFiles && !thisExclude.includes(file)) {
        templateDir({
          source: thisFile,
          destination: destinationPath,
          onlyFiles: thisOnlyFiles,
          exclude: thisExclude,
        }, data);
      } else if (!stat.isDirectory()) {
        const template = fs.readFileSync(thisFile, 'utf-8');
        const filledTemplate = renderString(template, data);

        fs.writeFileSync(destinationPath, filledTemplate);
      }
    });
  } catch (e) {
    throw new Error(e);
  }
};

export default templateDir;

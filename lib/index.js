import fs from 'fs';
import path from 'path';
import pathIsAbsolute from 'path-is-absolute';
import { get as valueForProperty } from 'dot-prop';

/**
 * Gets the rendered output of a template
 * @param {String} template - A template to use as a base for the render
 * @param {Object} data - The data to use when populating the templates
 * @param {RegExp} variableRegex - The regex to use for indentifying template variables
 */
function getRenderedTemplate(template, data, variableRegex) {
  return template.replace(variableRegex, (match, captured) => {
    const replacement = valueForProperty(data, captured.trim());
    // If a template variable is found but nothing is supplied to fill it, remove it
    if (replacement == null) {
      return '';
    }

    // If the replacement is a function, replace the variable with the result of the function
    if (typeof replacement === 'function') {
      return replacement();
    }

    // otherwise replace the template variable with the associated data
    return replacement;
  });
}

/**
 * Gets the processed filepath of a dynamic filepath
 * @param {String} file - A filepath to search for variables
 * @param {Object} data - The data to use if a variable is found
 */
function getProcessedPath(file, data) {
  return file.replace(/__[A-Za-z0-9-]+__/g, (match) => {
    const dataKey = match.substring(2, match.length - 2);
    const dataVal = data[dataKey];

    if (dataVal) {
      return dataVal;
    }
    return match;
  });
}

/**
 * Creates file resources based on another file resource
 *
 * @param {String} arg0.source - The path to the source files
 * @param {String} arg0.destination - The base path of the generated files
 * @param {Boolean} arg0.onlyFiles - Whether to only generate files
 * @param {Array} arg0.exclude - The paths to exclude from generated files
 * @param {RegExp} arg0.variableRegex - The pattern for indentifying template variables
 * @param {Object} data - The data to pass to the templates when generating
 */
function scaffold(
  {
    source = '',
    destination = 'destination',
    onlyFiles = false,
    exclude = [],
    variableRegex = /\{\{\s?(.*?)\s?\}\}/g,
  } = {},
  data = {},
) {
  const cwd = process.cwd();

  const thisSource = pathIsAbsolute(source) ? source : path.join(cwd, source);
  const thisDestination = pathIsAbsolute(destination) ? destination : path.join(cwd, destination);
  const thisOnlyFiles = onlyFiles;
  const thisExclude = exclude;
  const thisVariableRegex = variableRegex;


  try {
    const listOfFiles = fs.readdirSync(thisSource);
    const destinationExists = fs.existsSync(thisDestination);

    if (!destinationExists) {
      fs.mkdirSync(thisDestination);
    }

    listOfFiles.forEach((file) => {
      const thisFile = path.join(thisSource, file);
      const stat = fs.statSync(thisFile);
      const destinationFilename = getProcessedPath(file, data);
      const destinationPath = path.join(thisDestination, destinationFilename);

      if (stat && stat.isDirectory() && !thisOnlyFiles && !thisExclude.includes(file)) {
        scaffold({
          source: thisFile,
          destination: destinationPath,
          onlyFiles: thisOnlyFiles,
          exclude: thisExclude,
          variableRegex: thisVariableRegex,
        }, data);
      } else if (!stat.isDirectory()) {
        const template = fs.readFileSync(thisFile, 'utf-8');
        const filledTemplate = getRenderedTemplate(template, data, thisVariableRegex);

        fs.writeFileSync(destinationPath, filledTemplate);
      }
    });
  } catch (e) {
    throw new Error(e);
  }
}

export {
  scaffold as default,
  getProcessedPath,
  getRenderedTemplate,
};

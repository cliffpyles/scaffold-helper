import test from 'ava';
import fs from 'fs-extra';
import path from 'path';

import scaffold from '../lib';

test.before(() => {
  const cwd = process.cwd();
  const destinationFixtures1 = path.join(cwd, 'test', 'fixtures', 'destination1');
  const destinationFixturesCustom = path.join(cwd, 'test', 'fixtures', 'custom-destination');

  fs.mkdirSync(destinationFixtures1);
  fs.mkdirSync(destinationFixturesCustom);
});

test.after.always(() => {
  const cwd = process.cwd();
  const destinationFixtures1 = path.join(cwd, 'test', 'fixtures', 'destination1');
  const destinationFixtures2 = path.join(cwd, 'test', 'fixtures', 'destination2');
  const destinationFixtures3 = path.join(cwd, 'test', 'fixtures', 'destination3');
  const destinationFixtures4 = path.join(cwd, 'test', 'fixtures', 'destination4');
  const destinationFixturesCustom = path.join(cwd, 'test', 'fixtures', 'custom-destination');

  fs.removeSync(destinationFixtures1);
  fs.removeSync(destinationFixtures2);
  fs.removeSync(destinationFixtures3);
  fs.removeSync(destinationFixtures4);
  fs.removeSync(destinationFixturesCustom);
});

test('TEMPLATE DIR | recursively', (t) => {
  const cwd = process.cwd();
  const source = path.join(cwd, 'test', 'fixtures', 'source');
  const destination = path.join(cwd, 'test', 'fixtures', 'destination1');
  const onlyFiles = false;
  const data = {
    type: 'example',
    name: 'Cliff',
    age: '34',
  };

  scaffold({ source, destination, onlyFiles }, data);

  const valueDestinationDir = fs.readdirSync(destination);
  const expectedDestinationDir = [
    'dir-1',
    'dir-2',
    'example.txt',
    'template-1',
  ];

  const valueDestinationDir1 = fs.readdirSync(path.join(destination, 'dir-1'));
  const expectedDestinationDir1 = [
    'dir-3',
    'dir-4',
    'dir-5',
    'file-1',
  ];

  const valueDestinationDir2 = fs.readdirSync(path.join(destination, 'dir-2'));
  const expectedDestinationDir2 = [
    'file-2',
  ];

  const valueDestinationDir3 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-3'));
  const expectedDestinationDir3 = [
    'file-3',
  ];

  const valueDestinationDir4 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-4'));
  const expectedDestinationDir4 = [
    'file-4',
  ];

  const valueDestinationDir5 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-5'));
  const expectedDestinationDir5 = [
    'file-5',
  ];

  const valueTemplate1 = fs.readFileSync(path.join(destination, 'template-1'), 'utf-8');
  const expectedTemplate1 = 'My name is Cliff and I am 34 years old.\n';

  t.deepEqual(valueDestinationDir, expectedDestinationDir);
  t.deepEqual(valueDestinationDir1, expectedDestinationDir1);
  t.deepEqual(valueDestinationDir2, expectedDestinationDir2);
  t.deepEqual(valueDestinationDir3, expectedDestinationDir3);
  t.deepEqual(valueDestinationDir4, expectedDestinationDir4);
  t.deepEqual(valueDestinationDir5, expectedDestinationDir5);
  t.is(valueTemplate1, expectedTemplate1);
});

test('TEMPLATE DIR | files only', (t) => {
  const source = path.join('test', 'fixtures', 'source');
  const destination = path.join('test', 'fixtures', 'destination2');
  const onlyFiles = true;
  const data = {
    type: 'example',
    name: 'Cliff',
    age: '34',
  };

  scaffold({ source, destination, onlyFiles }, data);

  const valueDestinationDir = fs.readdirSync(destination);
  const expectedDestinationDir = [
    'example.txt',
    'template-1',
  ];

  const valueTemplate1 = fs.readFileSync(path.join(destination, 'template-1'), 'utf-8');
  const expectedTemplate1 = 'My name is Cliff and I am 34 years old.\n';

  t.deepEqual(valueDestinationDir, expectedDestinationDir);
  t.is(valueTemplate1, expectedTemplate1);
});

test('TEMPLATE DIR | throws', (t) => {
  const cwd = process.cwd();
  const wrongSource = path.join(cwd, 'test', 'fixtures', 'sourc');
  const destination = path.join(cwd, 'test', 'fixtures', 'dest');

  t.throws(() => scaffold({ source: wrongSource, destination }, {}));
});

test.serial('TEMPLATE DIR | recursively with default values', async (t) => {
  const cwd = process.cwd();
  const source = path.join(cwd, 'test', 'fixtures', 'source');
  const destination = path.join(source, 'destination');

  await process.chdir(source);

  scaffold();

  const valueDestinationDir = fs.readdirSync(destination);
  const expectedDestinationDir = [
    '__type__.txt',
    'dir-1',
    'dir-2',
    'template-1',
  ];

  const valueDestinationDir1 = fs.readdirSync(path.join(destination, 'dir-1'));
  const expectedDestinationDir1 = [
    'dir-3',
    'dir-4',
    'dir-5',
    'file-1',
  ];

  const valueDestinationDir2 = fs.readdirSync(path.join(destination, 'dir-2'));
  const expectedDestinationDir2 = [
    'file-2',
  ];

  const valueDestinationDir3 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-3'));
  const expectedDestinationDir3 = [
    'file-3',
  ];

  const valueDestinationDir4 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-4'));
  const expectedDestinationDir4 = [
    'file-4',
  ];

  const valueDestinationDir5 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-5'));
  const expectedDestinationDir5 = [
    'file-5',
  ];

  const valueTemplate1 = fs.readFileSync(path.join(destination, 'template-1'), 'utf-8');
  const expectedTemplate1 = 'My name is  and I am  years old.\n';

  fs.removeSync(destination);

  t.deepEqual(valueDestinationDir, expectedDestinationDir);
  t.deepEqual(valueDestinationDir1, expectedDestinationDir1);
  t.deepEqual(valueDestinationDir2, expectedDestinationDir2);
  t.deepEqual(valueDestinationDir3, expectedDestinationDir3);
  t.deepEqual(valueDestinationDir4, expectedDestinationDir4);
  t.deepEqual(valueDestinationDir5, expectedDestinationDir5);
  t.is(valueTemplate1, expectedTemplate1);

  await process.chdir(cwd);
});

test('TEMPLATE DIR | recursively, with excluding dir-2, dir-4', (t) => {
  const cwd = process.cwd();
  const source = path.join(cwd, 'test', 'fixtures', 'source');
  const destination = path.join(cwd, 'test', 'fixtures', 'destination4');
  const onlyFiles = false;
  const exclude = ['dir-2', 'dir-4'];
  const data = {
    type: 'example',
    name: 'Cliff',
    age: '34',
  };

  scaffold({ source, destination, onlyFiles, exclude }, data);

  const valueDestinationDir = fs.readdirSync(destination);
  const expectedDestinationDir = [
    'dir-1',
    'example.txt',
    'template-1',
  ];

  const valueDestinationDir1 = fs.readdirSync(path.join(destination, 'dir-1'));
  const expectedDestinationDir1 = [
    'dir-3',
    'dir-5',
    'file-1',
  ];

  const valueDestinationDir3 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-3'));
  const expectedDestinationDir3 = [
    'file-3',
  ];

  const valueDestinationDir5 = fs.readdirSync(path.join(destination, 'dir-1', 'dir-5'));
  const expectedDestinationDir5 = [
    'file-5',
  ];

  const valueTemplate1 = fs.readFileSync(path.join(destination, 'template-1'), 'utf-8');
  const expectedTemplate1 = 'My name is Cliff and I am 34 years old.\n';

  t.deepEqual(valueDestinationDir, expectedDestinationDir);
  t.deepEqual(valueDestinationDir1, expectedDestinationDir1);
  t.deepEqual(valueDestinationDir3, expectedDestinationDir3);
  t.deepEqual(valueDestinationDir5, expectedDestinationDir5);
  t.is(valueTemplate1, expectedTemplate1);
});

test('TEMPLATE DIR | custom template variables', (t) => {
  const source = path.join('test', 'fixtures', 'custom');
  const destination = path.join('test', 'fixtures', 'custom-destination');
  const onlyFiles = true;
  const data = {
    type: 'example',
    name: 'Cliff',
    age: '34',
  };
  const variableRegex = /\[\[\s?(.*?)\s?\]\]/g;

  scaffold({
    source,
    destination,
    onlyFiles,
    variableRegex,
  }, data);

  const valueDestinationDir = fs.readdirSync(destination);
  const expectedDestinationDir = [
    'custom-variables.txt',
  ];

  const valueTemplate1 = fs.readFileSync(path.join(destination, 'custom-variables.txt'), 'utf-8');
  const expectedTemplate1 = 'My name is Cliff and I am 34 years old.\n';

  t.deepEqual(valueDestinationDir, expectedDestinationDir);
  t.is(valueTemplate1, expectedTemplate1);
});

import { copy, readFile, writeFile, pathExistsSync } from 'fs-extra';
import glob from 'glob';

export type CopyBaseOptions = Record<'esStr' | 'libStr', string>;

const importLibToEs = async ({ libStr, esStr, filename }: CopyBaseOptions & { filename: string }) => {
  if (!pathExistsSync(filename)) {
    return Promise.resolve();
  }

  const fileContent: string = (await readFile(filename)).toString();

  return writeFile(filename, fileContent.replace(new RegExp(libStr, 'g'), esStr));
};

export const runCopy = ({
  resolveForItem,
  ...lastOpts
}: CopyBaseOptions & { resolveForItem?: (filename: string) => unknown }) => {
  return new Promise((resolve, reject) => {
    glob(`./src/**/*`, (err, files) => {
      if (err) {
        return reject(err);
      }

      const all = [] as Promise<unknown>[];

      for (let i = 0; i < files.length; i += 1) {
        const filename = files[i];

        resolveForItem?.(filename);

        if (/\.(less|scss)$/.test(filename)) {
          all.push(copy(filename, filename.replace(/src\//, 'dist/')));

          continue;
        }

        if (/\/style.ts$/.test(filename)) {
          importLibToEs({
            ...lastOpts,
            filename: filename.replace(/src\//, 'dist/').replace(/\.ts$/, '.js'),
          });

          continue;
        }
      }
    });
  });
};

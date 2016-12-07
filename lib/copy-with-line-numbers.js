'use babel';

import { CompositeDisposable } from 'atom';
import path from 'path';
import leftPad from 'left-pad';

export default {

  subscriptions: null,
  multiSelectionSeparator: '---',

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'copy-with-line-numbers:without-path': () => { this.withoutPath(); },
      'copy-with-line-numbers:with-full-path': () => { this.withFullPath(); },
      'copy-with-line-numbers:with-relative-path': () => { this.withRelativePath(); },
      'copy-with-line-numbers:with-file-name': () => { this.withFileName(); },
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  copyWithLineNumbers(filePath) {
    if (!atom.workspace.getActiveTextEditor()) return;

    let str = '';

    if (filePath) str += `File: ${filePath}\n`;
    str += this.getLinesWithNumbers();

    atom.clipboard.write(str);
  },

  getLinesWithNumbers() {
    let lines = '';

    const editor = atom.workspace.getActiveTextEditor();
    const selections = editor.getSelectionsOrderedByBufferPosition();
    const lastSelection = selections[selections.length - 1];
    const largestLineNumber = lastSelection.getBufferRowRange()[1] + 1;
    const largestLineNumberLength = largestLineNumber.toString().length;

    selections.forEach((selection, i) => {
      if (i > 0) lines += `${this.multiSelectionSeparator}\n`;

      const [startRowNumber, endRowNumber] = selection.getBufferRowRange();
      for (let r = startRowNumber; r <= endRowNumber; r++) {
        const number = leftPad(r + 1, largestLineNumberLength ,0);
        const line = editor.lineTextForBufferRow(r);
        lines += `${number}: ${line}\n`;
      }
    });

    return lines;
  },

  getFullPath() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) return null;
    return editor.getPath();
  },

  getRelativePath() {
    const fullPath = this.getFullPath();
    if (!fullPath) return null;

    const [projectPath, relativePath] = atom.project.relativizePath(fullPath);
    return relativePath;
  },

  getFileName() {
    const fullPath = this.getFullPath();
    if (!fullPath) return null;

    return path.basename(fullPath);
  },

  withoutPath() {
    this.copyWithLineNumbers();
  },

  withFullPath() {
    const fullPath = this.getFullPath() || '<unsaved>';
    this.copyWithLineNumbers(fullPath);
  },

  withRelativePath() {
    const relativePath = this.getRelativePath() || '<unsaved>';
    this.copyWithLineNumbers(relativePath);
  },

  withFileName() {
    const fileName = this.getFileName() || '<unsaved>';
    this.copyWithLineNumbers(fileName);
  },
};

'use babel';

import CopyWithLineNumbersView from './copy-with-line-numbers-view';
import { CompositeDisposable } from 'atom';

export default {

  copyWithLineNumbersView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.copyWithLineNumbersView = new CopyWithLineNumbersView(state.copyWithLineNumbersViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.copyWithLineNumbersView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'copy-with-line-numbers:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.copyWithLineNumbersView.destroy();
  },

  serialize() {
    return {
      copyWithLineNumbersViewState: this.copyWithLineNumbersView.serialize()
    };
  },

  toggle() {
    console.log('CopyWithLineNumbers was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};

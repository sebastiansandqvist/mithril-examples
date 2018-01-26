import m from 'mithril';
import Page from './Page.js';
import MainView from './MainView.js';
import examples from '../examples';

const ExamplesPage = {
  view() {
    return m(Page, { id: 'Examples' }, m(MainView, { examples }));
  }
};

export default ExamplesPage;

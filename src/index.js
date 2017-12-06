import widgetDetails from './widget-details';
import widgetLatest from './widget-latest';

(async () => {
  console.log('test')
  const { pathname } = window.location;
  if (pathname === '/') {
    widgetDetails();
  }
  else if (pathname.indexOf('/title/') > 0) {
    widgetLatest();
  }
})();

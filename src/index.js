import widgetDetails from './widget-details';
import widgetLatest from './widget-latest';

(async () => {
  const { pathname } = window.location;
  if (pathname === '/') {
    widgetDetails();
  }
  else if (pathname.indexOf('/title/') > 0) {
    widgetLatest();
  }
})();

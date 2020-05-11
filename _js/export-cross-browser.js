    // placing meta in body
    // https://stackoverflow.com/questions/1447842/what-happens-if-the-meta-tags-are-present-in-the-document-body
    // can define tag in class definition
    // customElements.define('my-component', class extends HTMLElement {}
    class CrossBrowser extends HTMLElement {
      // constructor() creates class
      // not yet part of the DOM and is just a regular tag
      // <h1> gets styling from page level <style>
      constructor() {
        super(); // this is needed to inherit HTMLElement properties and is standard JavaScript
        console.log('Component created…');
      }
      connectedCallback() {
        // this as the event when the component is attached to the DOM
        console.log('Component now part of DOM…');
        this.innerHTML = ` 
          <meta name="theme-color" content="#2196f3" />
          <meta name="apple-mobile-web-app-title" content="wpPWA">
          <meta name="apple-mobile-web-app-capable" content="yes">
          <meta name="apple-mobile-web-app-status-bar-style" content="black">   
          <link rel="apple-touch-startup-image" href="../_images/wppwa.png">
          <link rel="apple-touch-icon" sizes="57x57" href="images-manifest/apple-touch-icon-57x57.png">
          <link rel="apple-touch-icon" sizes="114x114" href="../_images-manifest/apple-touch-icon-114x114.png">
          <link rel="apple-touch-icon" sizes="72x72" href="../_images-manifest/apple-touch-icon-72x72.png">
          <link rel="apple-touch-icon" sizes="144x144" href="../_images-manifest/apple-touch-icon-144x144.png">
          <link rel="apple-touch-icon" sizes="60x60" href="../_images-manifest/apple-touch-icon-60x60.png">
          <link rel="apple-touch-icon" sizes="120x120" href="../_images-manifest/apple-touch-icon-120x120.png">
          <link rel="apple-touch-icon" sizes="76x76" href="../_images-manifest/apple-touch-icon-76x76.png">
          <link rel="apple-touch-icon" sizes="152x152" href="../_images-manifest/apple-touch-icon-152x152.png">
          <link rel="icon" type="image/png" href="../_images-manifest/icon-192x192.png" sizes="192x192">
          <link rel="icon" type="image/png" href="../_images-manifest/icon-96x96.png" sizes="96x96">
          <link rel="icon" type="image/png" href="../_images-manifest/icon-144x144.png" sizes="144x144">
          <link rel="icon" type="image/png" href="../_images-manifest/icon-128.png" sizes="128x128">

          <meta name="msapplication-TileColor" content="#2D91F8">
          <meta name="msapplication-TileImage" content="../_images-manifest/icons/ms-icon-144x144.png">
          <meta name="msapplication-square70x70logo" content="../_images-manifest/icons/ms-icon-70x70.png">
          <meta name="msapplication-square150x150logo" content="../_images-manifest/icons/ms-icon-150x150.png">
          <meta name="msapplication-square310x310logo" content="../_images-manifest/icons/ms-icon-310x310.png">
        `;

      }
    }

    customElements.define('cross-browser', CrossBrowser);
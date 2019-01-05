import mdcAutoInit from '@material/auto-init';
import {MDCTextField} from '@material/textfield/index';
import {MDCRipple} from '@material/ripple/index';
import {MDCTopAppBar} from '@material/top-app-bar/index';
import {MDCDrawer} from '@material/drawer/index';
import {MDCLinearProgress} from '@material/linear-progress/index';

import pdfjs from "pdfjs-dist/build/pdf";

pdfjs.GlobalWorkerOptions.workerSrc = '/static/pdfjsWorker.bundle.js';

mdcAutoInit.register('MDCTextField', MDCTextField);
mdcAutoInit.register('MDCRipple', MDCRipple);
mdcAutoInit.register('MDCTopAppBar', MDCTopAppBar);
mdcAutoInit.register('MDCDrawer', MDCDrawer);

mdcAutoInit();

if (document.getElementById('app-bar') !== null) {
    const drawer = MDCDrawer.attachTo(document.getElementById('app-drawer'));
    const listEl = document.querySelector('#app-drawer .mdc-list');
    listEl.addEventListener('click', (event) => {
        drawer.open = false;
    });

    const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
    topAppBar.setScrollTarget(document.getElementById('main-content'));
    topAppBar.listen('MDCTopAppBar:nav', () => {
        drawer.open = !drawer.open;
    });
}

if (document.getElementById("document") !== null) {
    const document_elm = document.getElementById("document");

    const document_data = JSON.parse(Array.prototype.slice.call(
        document_elm.getElementsByTagName("script"))
        .find(e => e.attributes.type.value === "application/document-data").text);

    const progress = MDCLinearProgress.attachTo(document_elm.getElementsByClassName("mdc-linear-progress")[0]);
    const canvas = document_elm.getElementsByTagName("canvas")[0];

    canvas.display = "none";

    const isIntersect = (point, square) => {
        return point.x >= square.left && point.x <= square.right && point.y >= square.top && point.y <= square.bottom;
    };

    const loadingTask = pdfjs.getDocument(document_elm.dataset.docUrl);
    loadingTask.promise.then(function (pdf) {
        console.log('PDF loaded');

        const pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {
            console.log('Page loaded');

            const scale = 1.3;
            const viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            const renderTask = page.render(renderContext);
            renderTask.then(function () {
                console.log('Page rendered');
                progress.close();
                canvas.display = "block";

                document_data.areas.forEach(area => {
                    context.lineWidth = 2;
                    context.lineCap = 'square';
                    context.lineJoin = 'round';
                    context.strokeStyle = 'rgb(0, 100, 50)';
                    context.strokeRect(area.left, area.top, area.right - area.left, area.bottom - area.top);
                    context.font = '50px sans-serif';
                    const textMetric = context.measureText("test");
                    const lineHeight = context.measureText('M').width;
                    const desiredWidth = area.right - area.left;
                    const desiredHeight = area.bottom - area.top;
                    const widthScale = desiredWidth / textMetric.width;
                    const heightScale = desiredHeight / lineHeight;
                    context.font = 50*Math.min(widthScale, heightScale) + 'px sans-serif';
                    context.textBaseline = 'middle';
                    context.fillText("test", area.left, (area.top + area.bottom) / 2);
                });

                canvas.addEventListener('click', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    const pos = {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top
                    };
                    console.log(pos);
                    document_data.areas.forEach(area => {
                        if (isIntersect(pos, area)) {
                            console.log('click on area: ', area);
                        }
                    });
                });
            });
        });
    }, function (reason) {
        console.error(reason);
    });
}
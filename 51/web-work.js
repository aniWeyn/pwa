self.addEventListener('message', (ev) => {
    console.log('[in worker] Web worker started with data: ', ev.data);
    //console.log(ev.source.id);
    let data = ev.data.do;
    //console.log('data = ' + ev.data.do)
    switch (data) {
        case 'TASK01':
            self.postMessage('[FROM WORKER] TASK01 RECEIVEc');
            break;
        case ev.data.do:
            //console.log("FETCH");
            self.postMessage("[FROM WORKER] starting...")
            let url = 'http://jsonplaceholder.typicode.com/posts';
            console.log('[in worker] about to do the fetch for the data');

            fetch(url)
                .then(response => response.json())
                .then(fetchData => {
                    //console.log(fetchData);
                    self.postMessage(fetchData);

                })
                .then(self.postMessage("[FROM WORKER] JOB DONE!"))
                .catch(err => console.log(err));

            break;
        default:
            console.log('Invalid access');
            self.postMessage('Closing web worker');
            self.close();
    }

})
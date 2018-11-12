

$('#edit-queue-form').on('submit', e => {
    e.preventDefault();

    const data = {
        csrfToken: $('#csrfToken').val(),
        name: $('#queue-name').val(),
        filter: $('#queue-filter').val()
    };

    fetch(e.target.action, {
        method: e.target.method,
        redirect: "follow",
        credentials: "include",
        headers: { "Accept": "application/json", "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }).then(
        res => {
            if(res.ok) {
                window.location = '.';
            }
            else {
                alert(`An error occured with your submission. ${res.statusText}`);
            }
        },
        err => alert(`A network error occured, please try again later. ${err.message}`)
    );

});

$('.js-button-delete').on('click', e => {
    e.preventDefault();
    const btn = e.target;

    const action = btn.dataset.action;
    const method = btn.dataset.method;
    const name = btn.dataset.name;

    const confirm = window.confirm(`Are you sure you want to delete queue '${name}'?`);
    if(confirm) {

        fetch(action, {
            method,
            redirect: "follow",
            credentials: "include"
        }).then(
            res => {
                if(res.ok) {
                    window.location = window.location;
                }
                else {
                    alert(`An error occurred: ${res.statusText}`);
                }
            },
            err => alert(`A network error occured, please try again later. ${err.message}`)
        );
    }

})

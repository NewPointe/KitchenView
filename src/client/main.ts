/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

$('#edit-queue-form').on('submit', submitEvent => {
    submitEvent.preventDefault();

    const target = submitEvent.target as HTMLFormElement;

    const data = {
        csrfToken: $('#csrfToken').val(),
        name: $('#queue-name').val(),
        filter: $('#queue-filter').val()
    };

    fetch(target.action, {
        method: target.method,
        redirect: "follow",
        credentials: "include",
        headers: { "Accept": "application/json", "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(data)
    }).then(
        res => {
            if (res.ok) {
                window.location.assign("..");
            }
            else {
                alert(`An error occured with your submission. ${res.statusText}`);
            }
        },
        (err: Error) => alert(`A network error occured, please try again later. ${err.message}`)
    );

});

$('.js-button-delete').on('click', e => {
    e.preventDefault();
    const btn = e.target;

    const action = btn.dataset.action || ".";
    const method = btn.dataset.method || "DELETE";
    const typename = btn.dataset.typename;
    const name = btn.dataset.name;

    const confirm = window.confirm(`Are you sure you want to delete ${typename} '${name}'?`);
    if (confirm) {

        fetch(action, {
            method,
            redirect: "follow",
            credentials: "include"
        }).then(
            res => {
                if (res.ok) {
                    window.location = window.location;
                }
                else {
                    alert(`An error occurred: ${res.statusText}`);
                }
            },
            (err: Error) => alert(`A network error occured, please try again later. ${err.message}`)
        );
    }

});

$('.js-button-add').on('click', e => {
    e.preventDefault();
    const btn = e.target;

    const action = btn.dataset.action || ".";
    const method = btn.dataset.method || "POST";
    const body = btn.dataset.body;

    fetch(action, {
        method,
        redirect: "follow",
        credentials: "include",
        headers: { "Accept": "application/json", "Content-Type": "application/json; charset=utf-8" },
        body: body
    }).then(
        res => {
            if (res.ok) {
                window.location = window.location;
            }
            else {
                alert(`An error occurred: ${res.statusText}`);
            }
        },
        (err: Error) => alert(`A network error occured, please try again later. ${err.message}`)
    );

});

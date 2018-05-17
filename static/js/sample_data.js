// It is just an idea how you can structure your data during your page is running.
// You can use it for testing purposes by simply copy/paste/run in the Console tab in your browser

let keyInLocalStorage = 'proman-data';

let sampleData = {
    "statuses": [
        {
            "id": 1,
            "name": "New"
        },
        {
            "id": 2,
            "name": "In progress"
        },
        {
            "id": 3,
            "name": "Testing"
        },
        {
            "id": 4,
            "name": "Done"
        }
],
    "boards": [
        {
            "id": 1,
            "title": "ProMan Sprint 1",
            "is_active": true
        },
        {
            "id": 2,
            "title": "ProMan Sprint 2",
            "is_active": true
        }
    ],
    "cards": [
        {
            "id": 1,
            "title": "Create environment",
            "board_id": 1,
            "status_id": 4,
            "order": 1
        },
        {
            "id": 2,
            "title": "Presentation",
            "board_id": 1,
            "status_id": 2,
            "order": 1
        },
        {
            "id": 3,
            "title": "List boards",
            "board_id": 1,
            "status_id": 4,
            "order": 2
        },
        {
            "id": 4,
            "title": "Detailed board page",
            "board_id": 1,
            "status_id": 4,
            "order": 3
        },
        {
            "id": 5,
            "title": "Cards statuses and order",
            "board_id": 1,
            "status_id": 4,
            "order": 4
        },
        {
            "id": 7,
            "title": "Edit card title",
            "board_id": 1,
            "status_id": 4,
            "order": 6
        },
        {
            "id": 8,
            "title": "Delete boards and cards",
            "board_id": 1,
            "status_id": 4,
            "order": 7
        },
        {
            "id": 10,
            "title": "CSS",
            "board_id": 1,
            "status_id": 3,
            "order": 1
        },
        {
            "id": 11,
            "title": "Youtube tutorial: how to use the page",
            "board_id": 1,
            "status_id": 1,
            "order": 1
        },
        {
            "id": 12,
            "title": "PayPal donation",
            "board_id": 1,
            "status_id": 1,
            "order": 2
        },
        {
            "id": 13,
            "title": "Script to mine bitcoin on the machines of the users",
            "board_id": 1,
            "status_id": 1,
            "order": 3
        },
        {
            "id": 14,
            "title": "Edit board title",
            "board_id": 1,
            "status_id": 1,
            "order": 4
        },
        {
            "id": 15,
            "title": "Store data in db",
            "board_id": 2,
            "status_id": 1,
            "order": 1
        },
        {
            "id": 16,
            "title": "User login",
            "board_id": 2,
            "status_id": 1,
            "order": 2
        },
        {
            "id": 17,
            "title": "User registration",
            "board_id": 2,
            "status_id": 1,
            "order": 3
        },
        {
            "id": 18,
            "title": "Delete cards",
            "board_id": 2,
            "status_id": 4,
            "order": 1
        },
        {
            "id": 18,
            "title": "Delete boards",
            "board_id": 2,
            "status_id": 4,
            "order": 2
        }

    ]
};

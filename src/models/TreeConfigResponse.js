export default        {
    label: 'Response',
    children: [
        {
            label: 'General',
            icon: 'settings',
        },
        {
            label: 'Adds',
            icon: 'add',
            selectable : false,
            children : [
                {
                    label: 'Adds.Header',
                    header: 'generic',
                    body: 'story',
                    story: 'Lorem ipsum dolor sit amet.',
                },
                {
                    label: 'Adds.Body',
                    header: 'generic',
                    body: 'story',
                    story: 'Lorem ipsum dolor sit amet.',
                },

            ]
        },
        {
            label: 'Modifies',
            icon: 'edit',
            selectable : false,
            children : [
                {
                    label: 'Modifies.Header',
                    header: 'generic',
                    body: 'story',
                    story: 'Lorem ipsum dolor sit amet.',
                },
                {
                    label: 'Modifies.Body',
                    header: 'generic',
                    body: 'story',
                    story: 'Lorem ipsum dolor sit amet.',
                },

            ]
        },
        {
            label: 'Deletes',
            icon: 'delete',
            selectable : false,
            children : [
                {
                    label: 'Deletes.Header',
                    header: 'generic',
                    body: 'story',
                    story: 'Lorem ipsum dolor sit amet.',
                },
                {
                    label: 'Deletes.Body',
                    header: 'generic',
                    body: 'story',
                    story: 'Lorem ipsum dolor sit amet.',
                },

            ]
        }
    ]
}
const eventFormValidate = {
    setupFormValidate: () => {
        const forms = document.querySelectorAll('.js-event-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                console.log('asdf')
            });
        });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    eventFormValidate.setupFormValidate();
});
console.log('123');
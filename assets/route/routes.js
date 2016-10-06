const routes = [
    {
        path: '/dash',
        name: 'dash',
        component(resolve) {
            require(['components/admin/dashboard'], resolve);
        }
    }
];
export default routes;
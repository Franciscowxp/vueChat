const routes = [
    {
        path: '/',
        name: 'home',
        component(resolve) {
            require(['components/home'], resolve);
        }
    },
    {
        path: '/dash',
        name: 'dash',
        component(resolve) {
            require(['components/admin/dashboard'], resolve);
        }
    }
];
export default routes;
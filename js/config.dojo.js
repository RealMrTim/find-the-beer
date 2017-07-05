var locationPath = location.pathname.replace(/\/[^\/]+$/, "");

window.dojoConfig = {
    packages: [{
        name: "widgets",
        location: locationPath + "/js/widgets/build"
    }]
};
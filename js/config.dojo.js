var locationPath = location.pathname.replace(/\/[^\/]+$/, "");
locationPath = locationPath.endsWith("/") ? locationPath : `${locationPath}/`

window.dojoConfig = {
    packages: [{
        name: "widgets",
        location: locationPath + `js/widgets/build`
    }]
};
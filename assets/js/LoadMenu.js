fetch("menu.json")
    .then(r => r.json())
    .then(menu => {

        const currentPage = window.location.pathname.split("/").pop();

        const path = findPath(menu, currentPage);

        const markedMenu = path
            ? markActive(menu, path)
            : menu;

        const nav = document.getElementById("nav");

        if (!nav) return;

        nav.innerHTML = "";
        nav.appendChild(buildMenu(markedMenu));

        // Ensure Dropotron runs AFTER DOM is updated + rendered
        requestAnimationFrame(() => {
            if (window.jQuery && $('#nav > ul').dropotron) {
                $('#nav > ul').dropotron({
                    mode: 'fade',
                    noOpenerFade: true,
                    alignment: 'center'
                });
            }

            // FORCE template to rebuild mobile nav if needed
            if (window.$ && $.fn.dropotron) {
                $(window).trigger('resize');
            }
        });
    });

/* -------------------- helpers -------------------- */

function findPath(items, target, path = []) {
    for (const item of items) {

        const currentPath = [...path, item];

        if (item.link === target) {
            return currentPath;
        }

        if (item.children) {
            const result = findPath(item.children, target, currentPath);
            if (result) return result;
        }
    }

    return null;
}

function markActive(items, path) {
    return items.map(item => {

        const isActive = path.includes(item);

        const newItem = {
            ...item,
            active: isActive
        };

        if (item.children) {
            newItem.children = markActive(item.children, path);
        }

        return newItem;
    });
}

function buildMenu(items) {
    const ul = document.createElement("ul");

    items.forEach(item => {
        const li = document.createElement("li");

        if (item.active) {
            li.classList.add("current");
        }

        const a = document.createElement("a");
        a.textContent = item.name;
        a.href = item.link || "#";

        li.appendChild(a);

        if (item.children && item.children.length > 0) {
            li.appendChild(buildMenu(item.children));
        }

        ul.appendChild(li);
    });

    return ul;
}
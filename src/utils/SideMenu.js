const SideMenuList = [
    { title: 'Dashboard', icon: 'mdi mdi-television menu-icon', navigateTo: '/register', isSubMenu: false, submenu: [] },
    { title: 'Question Bank', icon: 'fa fa-file-text-o menu-icon', navigateTo: '/register' },
    {
        title: 'Users', icon: 'mdi mdi-format-list-bulleted menu-icon', navigateTo: '/register', isSubMenu: true,
        submenu: [{
            title: 'Student Enrol', navigateTo: '/register'
        },
        { title: 'Faculty Enrol', navigateTo: '/register' }]
    },
    { title: 'Report', icon: 'mdi mdi-chart-line menu-icon', navigateTo: '/register' },
];
// to = "/register"
// Enroll Faculty

export default SideMenuList;



// menuItems(item, index) {
//     console.log(item, 'item');
//     if (!item) return null;
//     return (
//         <li className={this.isPathActive(item.navigateTo) ? 'nav-item active' : 'nav-item'}>
//             <div className={this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('basicUiMenuOpen')} data-toggle="collapse">
//                 <i className={item.icon}></i>
//                 <span className="menu-title">{item.title}</span>
//                 <i className="menu-arrow"></i>
//             </div>
//             {(item.isSubMenu && item.submenu.length > 0) && <Collapse in={this.state.basicUiMenuOpen}>
//                 <ul className="nav flex-column sub-menu">
//                     <li className="nav-item"> <Link className={this.isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link'} to="/basic-ui/buttons">Buttons</Link></li>
//                 </ul>
//             </Collapse>}
//         </li>
//     )
// }
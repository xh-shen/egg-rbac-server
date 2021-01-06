/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : rbac

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 06/01/2021 10:03:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for gas_api
-- ----------------------------
DROP TABLE IF EXISTS `gas_api`;
CREATE TABLE `gas_api` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '接口名称',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '接口路径',
  `method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '接口方法',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '描述',
  `status` int DEFAULT '1' COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `gas_menu_id` int DEFAULT NULL,
  `gas_permission_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gas_menu_id` (`gas_menu_id`),
  KEY `gas_permission_id` (`gas_permission_id`),
  CONSTRAINT `gas_api_ibfk_1` FOREIGN KEY (`gas_menu_id`) REFERENCES `gas_menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `gas_api_ibfk_2` FOREIGN KEY (`gas_permission_id`) REFERENCES `gas_permission` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_api
-- ----------------------------
BEGIN;
INSERT INTO `gas_api` VALUES (2, '修改用户', '/admin/v1/user/:id', 'PUT', '', 1, '2019-07-29 07:44:31', '2019-07-30 08:32:03', 5, 11);
INSERT INTO `gas_api` VALUES (5, '添加用户', '/admin/v1/user', 'POST', '', 1, '2019-07-29 08:02:22', '2019-07-30 08:31:55', 5, 15);
INSERT INTO `gas_api` VALUES (6, '获取用户列表', '/admin/v1/user', 'GET', '公共接口', 1, '2019-07-29 08:36:06', '2019-07-30 08:32:41', 5, 16);
INSERT INTO `gas_api` VALUES (7, '获取所有地区', '/admin/v1/all/region', 'GET', '', 1, '2019-07-29 10:22:14', '2019-10-14 10:08:48', NULL, 18);
INSERT INTO `gas_api` VALUES (8, '获取用户详情', '/admin/v1/user/:id', 'GET', '', 1, '2019-07-30 08:33:05', '2019-07-30 08:33:05', 5, 31);
INSERT INTO `gas_api` VALUES (9, '获取所有用户', '/admin/v1/all/user', 'GET', '', 1, '2019-07-30 08:33:56', '2019-07-30 08:33:56', 5, 32);
INSERT INTO `gas_api` VALUES (10, '获取角色列表', '/admin/v1/role', 'GET', '', 1, '2019-07-30 08:34:44', '2019-07-30 08:34:44', 2, 33);
INSERT INTO `gas_api` VALUES (11, '获取角色详情', '/admin/v1/role/:id', 'GET', '', 1, '2019-07-30 08:35:11', '2019-07-30 08:35:11', 2, 34);
INSERT INTO `gas_api` VALUES (12, '添加角色', '/admin/v1/role', 'POST', '', 1, '2019-07-30 08:35:22', '2019-07-30 08:35:22', 2, 35);
INSERT INTO `gas_api` VALUES (13, '修改角色', '/admin/v1/role/:id', 'PUT', '', 1, '2019-07-30 08:35:35', '2019-07-30 08:35:35', 2, 36);
INSERT INTO `gas_api` VALUES (14, '获取所有角色', '/admin/v1/all/role', 'GET', '', 1, '2019-07-30 08:37:52', '2019-07-30 08:37:52', 2, 37);
INSERT INTO `gas_api` VALUES (15, '关联用户', '/admin/v1/role/:id/user/set', 'POST', '', 1, '2019-07-30 08:38:22', '2019-07-30 08:38:22', 2, 38);
INSERT INTO `gas_api` VALUES (16, '角色获取权限', '/admin/v1/role/:id/permission/get', 'GET', '', 1, '2019-07-30 08:40:13', '2019-07-30 08:40:13', 2, 39);
INSERT INTO `gas_api` VALUES (17, '角色授权', '/admin/v1/role/:id/permission/set', 'POST', '', 1, '2019-07-30 08:40:55', '2019-07-30 08:40:55', 2, 40);
INSERT INTO `gas_api` VALUES (18, '删除用户', '/admin/v1/user/:id', 'DELETE', '', 1, '2019-07-30 10:54:32', '2019-07-30 10:54:32', 5, 43);
INSERT INTO `gas_api` VALUES (19, '重置密码', '/admin/v1//user/:id/reset', 'GET', '', 1, '2019-07-30 15:22:55', '2019-07-30 15:22:55', 5, 45);
INSERT INTO `gas_api` VALUES (20, '删除角色', '/admin/v1/role/:id', 'DELETE', '', 1, '2019-07-30 21:33:34', '2019-07-30 21:33:34', 2, 55);
INSERT INTO `gas_api` VALUES (21, '获取公司列表', '/admin/v1/company', 'GET', '', 1, '2019-10-14 12:52:32', '2019-10-14 12:52:32', 10, 61);
INSERT INTO `gas_api` VALUES (22, '获取公司详情', '/admin/v1/company/:id', 'GET', '', 1, '2019-10-14 12:52:46', '2019-10-14 12:52:46', 10, 62);
INSERT INTO `gas_api` VALUES (23, '新增公司', '/admin/v1/company', 'POST', '', 1, '2019-10-14 12:53:02', '2019-10-14 12:53:02', 10, 63);
INSERT INTO `gas_api` VALUES (24, '修改公司', '/admin/v1/company/:id', 'PUT', '', 1, '2019-10-14 12:53:15', '2019-10-14 12:53:15', 10, 64);
INSERT INTO `gas_api` VALUES (25, '删除公司', '/admin/v1/company/:id', 'DELETE', '', 1, '2019-10-14 12:53:26', '2019-10-14 12:53:26', 10, 65);
INSERT INTO `gas_api` VALUES (26, '获取地区所有公司', '/admin/v1/all/company', 'GET', '', 1, '2019-10-14 14:13:25', '2019-10-14 14:13:25', NULL, 66);
INSERT INTO `gas_api` VALUES (27, '获取员工列表', '/admin/v1/staff', 'GET', '', 1, '2019-10-14 14:55:23', '2019-10-14 14:55:23', 11, 70);
INSERT INTO `gas_api` VALUES (28, '获取员工详情', '/admin/v1/staff/:id', 'GET', '', 1, '2019-10-14 14:55:38', '2019-10-14 14:55:38', 11, 71);
INSERT INTO `gas_api` VALUES (29, '新增员工', '/admin/v1/staff', 'POST', '', 1, '2019-10-14 14:55:49', '2019-10-14 14:55:49', 11, 72);
INSERT INTO `gas_api` VALUES (30, '修改员工', '/admin/v1/staff/:id', 'PUT', '', 1, '2019-10-14 14:56:02', '2019-10-14 14:56:02', 11, 73);
INSERT INTO `gas_api` VALUES (31, '删除员工', '/admin/v1/staff/:id', 'DELETE', '', 1, '2019-10-14 14:56:17', '2019-10-14 14:56:17', 11, 74);
INSERT INTO `gas_api` VALUES (32, '上传图片', '/admin/v1/upload/picture', 'POST', '', 1, '2019-10-16 13:10:27', '2019-10-16 13:10:27', NULL, 75);
INSERT INTO `gas_api` VALUES (33, 'EXCEL导入', '/admin/v1/upload/excel/import/company', 'POST', '', 1, '2019-10-18 10:00:44', '2019-10-18 10:00:44', 10, 77);
INSERT INTO `gas_api` VALUES (34, '导出员工', '/admin/v1/export/staff', 'GET', '', 1, '2019-10-31 10:22:58', '2019-10-31 10:22:58', 11, 79);
COMMIT;

-- ----------------------------
-- Table structure for gas_company
-- ----------------------------
DROP TABLE IF EXISTS `gas_company`;
CREATE TABLE `gas_company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公司名称',
  `mobile` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '公司电话',
  `contacts` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '联系人',
  `contacts_mobile` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '联系人手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '公司邮箱',
  `website` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '公司网址',
  `status` int DEFAULT '1' COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `gas_region_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gas_region_id` (`gas_region_id`),
  CONSTRAINT `gas_company_ibfk_1` FOREIGN KEY (`gas_region_id`) REFERENCES `gas_region` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for gas_element
-- ----------------------------
DROP TABLE IF EXISTS `gas_element`;
CREATE TABLE `gas_element` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '元素名称',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '元素编码',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '描述',
  `status` int DEFAULT '1' COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `gas_menu_id` int DEFAULT NULL,
  `gas_permission_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `gas_menu_id` (`gas_menu_id`),
  KEY `gas_permission_id` (`gas_permission_id`),
  CONSTRAINT `gas_element_ibfk_1` FOREIGN KEY (`gas_menu_id`) REFERENCES `gas_menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `gas_element_ibfk_2` FOREIGN KEY (`gas_permission_id`) REFERENCES `gas_permission` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_element
-- ----------------------------
BEGIN;
INSERT INTO `gas_element` VALUES (1, '新增角色', 'add-role', '', 1, '2019-07-29 10:09:29', '2019-09-16 10:31:11', 2, 17);
INSERT INTO `gas_element` VALUES (2, '分配角色', 'user-role', '', 0, '2019-07-29 11:17:29', '2019-10-14 08:12:30', 5, 19);
INSERT INTO `gas_element` VALUES (3, '修改用户', 'edit-user', '', 1, '2019-07-29 13:40:06', '2019-07-29 19:49:48', 5, 20);
INSERT INTO `gas_element` VALUES (4, '新增用户', 'add-user', '添加用户的按钮', 1, '2019-07-29 13:43:58', '2019-09-16 10:31:22', 5, 21);
INSERT INTO `gas_element` VALUES (5, '修改角色', 'edit-role', '', 1, '2019-07-29 19:51:41', '2019-07-29 19:51:42', 2, 22);
INSERT INTO `gas_element` VALUES (6, '关联用户', 'role-user', '', 1, '2019-07-29 19:52:02', '2019-07-29 19:52:02', 2, 23);
INSERT INTO `gas_element` VALUES (7, '角色授权', 'role-permission', '', 1, '2019-07-29 19:52:20', '2019-07-29 19:52:20', 2, 24);
INSERT INTO `gas_element` VALUES (8, '添加菜单', 'add-menu', '', 1, '2019-07-29 22:09:09', '2019-07-29 22:18:48', 7, 25);
INSERT INTO `gas_element` VALUES (9, '修改菜单', 'edit-menu', '', 1, '2019-07-29 22:10:01', '2019-07-29 22:10:01', 7, 26);
INSERT INTO `gas_element` VALUES (10, '新增元素', 'add-element', '', 1, '2019-07-29 22:10:28', '2019-09-16 10:31:32', 8, 27);
INSERT INTO `gas_element` VALUES (11, '修改元素', 'edit-element', '', 1, '2019-07-29 22:10:57', '2019-07-29 22:10:57', 8, 28);
INSERT INTO `gas_element` VALUES (12, '新增接口', 'add-api', '', 1, '2019-07-29 22:11:09', '2019-09-16 10:31:39', 9, 29);
INSERT INTO `gas_element` VALUES (13, '修改接口', 'edit-api', '', 1, '2019-07-29 22:11:22', '2019-07-29 22:11:22', 9, 30);
INSERT INTO `gas_element` VALUES (14, '重置密码', 'reset-pwd', '', 1, '2019-07-30 10:23:15', '2019-07-30 10:23:15', 5, 41);
INSERT INTO `gas_element` VALUES (15, '删除用户', 'delete-user', '', 1, '2019-07-30 10:25:23', '2019-07-30 10:25:43', 5, 42);
INSERT INTO `gas_element` VALUES (16, '批量删除用户', 'mult-del-user', '', 1, '2019-07-30 14:09:06', '2019-07-30 14:09:06', 5, 44);
INSERT INTO `gas_element` VALUES (17, '删除角色', 'delete-role', '', 1, '2019-07-30 15:48:29', '2019-07-30 15:48:29', 2, 46);
INSERT INTO `gas_element` VALUES (18, '新增公司', 'add-company', '', 1, '2019-10-14 11:25:54', '2019-10-14 11:25:54', 10, 58);
INSERT INTO `gas_element` VALUES (19, '修改公司', 'edit-company', '', 1, '2019-10-14 11:26:18', '2019-10-14 11:26:18', 10, 59);
INSERT INTO `gas_element` VALUES (20, '删除公司', 'delete-company', '', 1, '2019-10-14 11:26:33', '2019-10-14 11:26:33', 10, 60);
INSERT INTO `gas_element` VALUES (21, '新增员工', 'add-staff', '', 1, '2019-10-14 14:54:28', '2019-10-14 14:54:28', 11, 67);
INSERT INTO `gas_element` VALUES (22, '修改员工', 'edit-staff', '', 1, '2019-10-14 14:54:41', '2019-10-14 14:54:41', 11, 68);
INSERT INTO `gas_element` VALUES (23, '删除员工', 'delete-staff', '', 1, '2019-10-14 14:54:57', '2019-10-14 14:54:57', 11, 69);
INSERT INTO `gas_element` VALUES (24, 'EXCEL导入', 'import-company', '', 1, '2019-10-18 09:59:54', '2019-10-18 09:59:54', 10, 76);
INSERT INTO `gas_element` VALUES (25, '导出员工', 'export-staff', '', 1, '2019-10-31 10:22:34', '2019-10-31 10:22:34', 11, 78);
COMMIT;

-- ----------------------------
-- Table structure for gas_menu
-- ----------------------------
DROP TABLE IF EXISTS `gas_menu`;
CREATE TABLE `gas_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单名称',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单编码',
  `pid` int NOT NULL DEFAULT '0' COMMENT '父级菜单id',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '路径',
  `cmp_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '组件路径',
  `sort` int DEFAULT '1' COMMENT '排序',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '图标',
  `active_menu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '高亮',
  `hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT '隐藏菜单',
  `is_router` int DEFAULT '0' COMMENT '路由',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '描述',
  `status` int DEFAULT '1' COMMENT '状态',
  `is_super` int DEFAULT '0' COMMENT '是否是超级',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `gas_permission_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `gas_permission_id` (`gas_permission_id`),
  CONSTRAINT `gas_menu_ibfk_1` FOREIGN KEY (`gas_permission_id`) REFERENCES `gas_permission` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_menu
-- ----------------------------
BEGIN;
INSERT INTO `gas_menu` VALUES (2, '角色管理', 'role', 4, '/system/role', 'views/system/role', 2, 'peoples', '', 0, 1, '', 1, 0, '2019-07-27 20:25:04', '2019-10-13 20:51:06', 2);
INSERT INTO `gas_menu` VALUES (4, '系统管理', 'system', 0, '/', '', 1, 'component', '', 0, 0, '', 1, 0, '2019-07-27 20:46:36', '2019-08-15 11:24:04', 4);
INSERT INTO `gas_menu` VALUES (5, '用户管理', 'user', 4, '/system/user', 'views/system/user', 1, 'user', '', 0, 1, '', 1, 0, '2019-07-27 20:47:40', '2019-10-13 14:50:54', 5);
INSERT INTO `gas_menu` VALUES (6, '权限管理', 'permission', 4, '/', '', 3, 'lock', '', 0, 0, '', 1, 1, '2019-07-27 21:17:13', '2019-08-15 11:26:27', 6);
INSERT INTO `gas_menu` VALUES (7, '菜单管理', 'menu', 6, '/system/permission/menu', 'views/system/menu', 1, 'tree-table', '', 0, 1, '', 1, 1, '2019-07-27 21:17:41', '2019-09-17 15:05:19', 7);
INSERT INTO `gas_menu` VALUES (8, '元素管理', 'element', 6, '/system/permission/element', 'views/system/element', 2, 'tree', '', 0, 1, '', 1, 1, '2019-07-27 21:18:29', '2019-09-17 15:05:26', 8);
INSERT INTO `gas_menu` VALUES (9, '接口管理', 'api', 6, '/system/permission/api', 'views/system/api', 3, 'password', '', 0, 1, '', 1, 1, '2019-07-27 21:18:54', '2019-09-17 15:05:32', 9);
INSERT INTO `gas_menu` VALUES (10, '公司管理', 'company', 0, '/company', 'views/company', 2, 'tab', '', 0, 1, '', 1, 0, '2019-10-14 10:40:14', '2019-10-14 10:41:47', 56);
INSERT INTO `gas_menu` VALUES (11, '员工管理', 'staff', 0, '/staff', 'views/staff', 3, 'peoples', '', 0, 1, '', 1, 0, '2019-10-14 10:43:09', '2019-10-14 10:43:09', 57);
INSERT INTO `gas_menu` VALUES (12, '导入数据', 'importData', 0, '/importData', 'views/importData', 10, 'example', '', 0, 1, '只用来导入数据', 1, 1, '2019-11-02 11:45:35', '2019-11-04 10:17:50', 80);
COMMIT;

-- ----------------------------
-- Table structure for gas_permission
-- ----------------------------
DROP TABLE IF EXISTS `gas_permission`;
CREATE TABLE `gas_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '权限类型',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_permission
-- ----------------------------
BEGIN;
INSERT INTO `gas_permission` VALUES (1, 'menu');
INSERT INTO `gas_permission` VALUES (2, 'menu');
INSERT INTO `gas_permission` VALUES (3, 'menu');
INSERT INTO `gas_permission` VALUES (4, 'menu');
INSERT INTO `gas_permission` VALUES (5, 'menu');
INSERT INTO `gas_permission` VALUES (6, 'menu');
INSERT INTO `gas_permission` VALUES (7, 'menu');
INSERT INTO `gas_permission` VALUES (8, 'menu');
INSERT INTO `gas_permission` VALUES (9, 'menu');
INSERT INTO `gas_permission` VALUES (11, 'api');
INSERT INTO `gas_permission` VALUES (14, 'menu');
INSERT INTO `gas_permission` VALUES (15, 'api');
INSERT INTO `gas_permission` VALUES (16, 'api');
INSERT INTO `gas_permission` VALUES (17, 'element');
INSERT INTO `gas_permission` VALUES (18, 'api');
INSERT INTO `gas_permission` VALUES (19, 'element');
INSERT INTO `gas_permission` VALUES (20, 'element');
INSERT INTO `gas_permission` VALUES (21, 'element');
INSERT INTO `gas_permission` VALUES (22, 'element');
INSERT INTO `gas_permission` VALUES (23, 'element');
INSERT INTO `gas_permission` VALUES (24, 'element');
INSERT INTO `gas_permission` VALUES (25, 'element');
INSERT INTO `gas_permission` VALUES (26, 'element');
INSERT INTO `gas_permission` VALUES (27, 'element');
INSERT INTO `gas_permission` VALUES (28, 'element');
INSERT INTO `gas_permission` VALUES (29, 'element');
INSERT INTO `gas_permission` VALUES (30, 'element');
INSERT INTO `gas_permission` VALUES (31, 'api');
INSERT INTO `gas_permission` VALUES (32, 'api');
INSERT INTO `gas_permission` VALUES (33, 'api');
INSERT INTO `gas_permission` VALUES (34, 'api');
INSERT INTO `gas_permission` VALUES (35, 'api');
INSERT INTO `gas_permission` VALUES (36, 'api');
INSERT INTO `gas_permission` VALUES (37, 'api');
INSERT INTO `gas_permission` VALUES (38, 'api');
INSERT INTO `gas_permission` VALUES (39, 'api');
INSERT INTO `gas_permission` VALUES (40, 'api');
INSERT INTO `gas_permission` VALUES (41, 'element');
INSERT INTO `gas_permission` VALUES (42, 'element');
INSERT INTO `gas_permission` VALUES (43, 'api');
INSERT INTO `gas_permission` VALUES (44, 'element');
INSERT INTO `gas_permission` VALUES (45, 'api');
INSERT INTO `gas_permission` VALUES (46, 'element');
INSERT INTO `gas_permission` VALUES (47, 'menu');
INSERT INTO `gas_permission` VALUES (48, 'menu');
INSERT INTO `gas_permission` VALUES (49, 'menu');
INSERT INTO `gas_permission` VALUES (50, 'menu');
INSERT INTO `gas_permission` VALUES (51, 'menu');
INSERT INTO `gas_permission` VALUES (52, 'menu');
INSERT INTO `gas_permission` VALUES (53, 'menu');
INSERT INTO `gas_permission` VALUES (54, 'menu');
INSERT INTO `gas_permission` VALUES (55, 'api');
INSERT INTO `gas_permission` VALUES (56, 'menu');
INSERT INTO `gas_permission` VALUES (57, 'menu');
INSERT INTO `gas_permission` VALUES (58, 'element');
INSERT INTO `gas_permission` VALUES (59, 'element');
INSERT INTO `gas_permission` VALUES (60, 'element');
INSERT INTO `gas_permission` VALUES (61, 'api');
INSERT INTO `gas_permission` VALUES (62, 'api');
INSERT INTO `gas_permission` VALUES (63, 'api');
INSERT INTO `gas_permission` VALUES (64, 'api');
INSERT INTO `gas_permission` VALUES (65, 'api');
INSERT INTO `gas_permission` VALUES (66, 'api');
INSERT INTO `gas_permission` VALUES (67, 'element');
INSERT INTO `gas_permission` VALUES (68, 'element');
INSERT INTO `gas_permission` VALUES (69, 'element');
INSERT INTO `gas_permission` VALUES (70, 'api');
INSERT INTO `gas_permission` VALUES (71, 'api');
INSERT INTO `gas_permission` VALUES (72, 'api');
INSERT INTO `gas_permission` VALUES (73, 'api');
INSERT INTO `gas_permission` VALUES (74, 'api');
INSERT INTO `gas_permission` VALUES (75, 'api');
INSERT INTO `gas_permission` VALUES (76, 'element');
INSERT INTO `gas_permission` VALUES (77, 'api');
INSERT INTO `gas_permission` VALUES (78, 'element');
INSERT INTO `gas_permission` VALUES (79, 'api');
INSERT INTO `gas_permission` VALUES (80, 'menu');
COMMIT;

-- ----------------------------
-- Table structure for gas_photos
-- ----------------------------
DROP TABLE IF EXISTS `gas_photos`;
CREATE TABLE `gas_photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `card_no` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '员工身份证号',
  `photo` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '员工工作照',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for gas_region
-- ----------------------------
DROP TABLE IF EXISTS `gas_region`;
CREATE TABLE `gas_region` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '地区名称',
  `status` int DEFAULT '1' COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_region
-- ----------------------------
BEGIN;
INSERT INTO `gas_region` VALUES (1, '长春地区', 1, '2019-10-13 21:48:32', '2019-10-13 21:48:38');
INSERT INTO `gas_region` VALUES (2, '吉林地区', 1, '2019-10-13 21:48:48', '2019-10-13 21:48:54');
INSERT INTO `gas_region` VALUES (3, '四平地区', 1, '2019-10-13 21:49:10', '2019-10-13 21:49:13');
INSERT INTO `gas_region` VALUES (4, '辽源地区', 1, '2019-10-13 21:50:17', '2019-10-13 21:50:21');
INSERT INTO `gas_region` VALUES (5, '通化地区', 1, '2019-10-13 21:50:46', '2019-10-13 21:50:50');
INSERT INTO `gas_region` VALUES (6, '白山地区', 1, '2019-10-13 21:52:04', '2019-10-13 21:52:08');
INSERT INTO `gas_region` VALUES (7, '白城地区', 1, '2019-10-13 21:52:21', '2019-10-13 21:52:24');
INSERT INTO `gas_region` VALUES (8, '延边地区', 1, '2019-10-13 21:52:51', '2019-10-13 21:52:54');
INSERT INTO `gas_region` VALUES (9, '松原地区', 1, '2019-10-13 21:53:12', '2019-10-13 21:53:14');
INSERT INTO `gas_region` VALUES (10, '公主岭', 1, '2019-10-16 19:31:12', '2019-10-16 19:31:15');
INSERT INTO `gas_region` VALUES (11, '梅河口', 1, '2019-10-16 19:31:53', '2019-10-16 19:31:56');
COMMIT;

-- ----------------------------
-- Table structure for gas_role
-- ----------------------------
DROP TABLE IF EXISTS `gas_role`;
CREATE TABLE `gas_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '描述',
  `status` int DEFAULT '1' COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_role
-- ----------------------------
BEGIN;
INSERT INTO `gas_role` VALUES (1, '省级管理员', '', 1, '2019-10-14 07:35:10', '2019-10-16 08:24:46');
INSERT INTO `gas_role` VALUES (2, '地区管理员', '', 1, '2019-10-14 10:36:51', '2019-10-16 08:24:40');
INSERT INTO `gas_role` VALUES (3, '公司管理员', '', 1, '2019-10-14 10:44:42', '2019-10-14 10:44:42');
COMMIT;

-- ----------------------------
-- Table structure for gas_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `gas_role_permission`;
CREATE TABLE `gas_role_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gas_role_id` int DEFAULT NULL,
  `gas_permission_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gas_role_permission_gasRoleId_gasPermissionId_unique` (`gas_role_id`,`gas_permission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_role_permission
-- ----------------------------
BEGIN;
INSERT INTO `gas_role_permission` VALUES (8, 1, 18, '2019-10-14 08:18:58', '2019-10-14 08:18:58');
INSERT INTO `gas_role_permission` VALUES (47, 1, 4, '2019-10-14 09:47:28', '2019-10-14 09:47:28');
INSERT INTO `gas_role_permission` VALUES (48, 1, 5, '2019-10-14 09:48:46', '2019-10-14 09:48:46');
INSERT INTO `gas_role_permission` VALUES (51, 1, 11, '2019-10-14 10:07:04', '2019-10-14 10:07:04');
INSERT INTO `gas_role_permission` VALUES (52, 1, 15, '2019-10-14 10:07:04', '2019-10-14 10:07:04');
INSERT INTO `gas_role_permission` VALUES (53, 1, 16, '2019-10-14 10:07:04', '2019-10-14 10:07:04');
INSERT INTO `gas_role_permission` VALUES (54, 1, 31, '2019-10-14 10:07:04', '2019-10-14 10:07:04');
INSERT INTO `gas_role_permission` VALUES (55, 1, 32, '2019-10-14 10:07:04', '2019-10-14 10:07:04');
INSERT INTO `gas_role_permission` VALUES (56, 1, 43, '2019-10-14 10:07:04', '2019-10-14 10:07:04');
INSERT INTO `gas_role_permission` VALUES (57, 1, 45, '2019-10-14 10:07:04', '2019-10-14 10:07:04');
INSERT INTO `gas_role_permission` VALUES (58, 1, 20, '2019-10-14 10:07:12', '2019-10-14 10:07:12');
INSERT INTO `gas_role_permission` VALUES (59, 1, 21, '2019-10-14 10:07:12', '2019-10-14 10:07:12');
INSERT INTO `gas_role_permission` VALUES (60, 1, 41, '2019-10-14 10:07:12', '2019-10-14 10:07:12');
INSERT INTO `gas_role_permission` VALUES (61, 1, 42, '2019-10-14 10:07:12', '2019-10-14 10:07:12');
INSERT INTO `gas_role_permission` VALUES (62, 1, 44, '2019-10-14 10:07:12', '2019-10-14 10:07:12');
INSERT INTO `gas_role_permission` VALUES (63, 2, 4, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (64, 2, 5, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (65, 2, 11, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (66, 2, 15, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (67, 2, 16, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (68, 2, 18, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (69, 2, 20, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (70, 2, 21, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (71, 2, 31, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (72, 2, 32, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (73, 2, 41, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (74, 2, 42, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (75, 2, 43, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (76, 2, 44, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (77, 2, 45, '2019-10-14 10:37:27', '2019-10-14 10:37:27');
INSERT INTO `gas_role_permission` VALUES (78, 2, 56, '2019-10-14 10:40:44', '2019-10-14 10:40:44');
INSERT INTO `gas_role_permission` VALUES (79, 3, 57, '2019-10-14 10:45:14', '2019-10-14 10:45:14');
INSERT INTO `gas_role_permission` VALUES (80, 2, 58, '2019-10-14 12:50:57', '2019-10-14 12:50:57');
INSERT INTO `gas_role_permission` VALUES (81, 2, 59, '2019-10-14 12:50:57', '2019-10-14 12:50:57');
INSERT INTO `gas_role_permission` VALUES (82, 2, 60, '2019-10-14 12:50:57', '2019-10-14 12:50:57');
INSERT INTO `gas_role_permission` VALUES (83, 2, 61, '2019-10-14 12:53:45', '2019-10-14 12:53:45');
INSERT INTO `gas_role_permission` VALUES (84, 2, 62, '2019-10-14 12:53:45', '2019-10-14 12:53:45');
INSERT INTO `gas_role_permission` VALUES (85, 2, 63, '2019-10-14 12:53:45', '2019-10-14 12:53:45');
INSERT INTO `gas_role_permission` VALUES (86, 2, 64, '2019-10-14 12:53:45', '2019-10-14 12:53:45');
INSERT INTO `gas_role_permission` VALUES (87, 2, 65, '2019-10-14 12:53:45', '2019-10-14 12:53:45');
INSERT INTO `gas_role_permission` VALUES (88, 1, 56, '2019-10-14 12:54:07', '2019-10-14 12:54:07');
INSERT INTO `gas_role_permission` VALUES (89, 1, 61, '2019-10-14 12:54:07', '2019-10-14 12:54:07');
INSERT INTO `gas_role_permission` VALUES (90, 2, 66, '2019-10-14 14:13:43', '2019-10-14 14:13:43');
INSERT INTO `gas_role_permission` VALUES (91, 3, 18, '2019-10-14 14:13:56', '2019-10-14 14:13:56');
INSERT INTO `gas_role_permission` VALUES (92, 3, 66, '2019-10-14 14:13:56', '2019-10-14 14:13:56');
INSERT INTO `gas_role_permission` VALUES (93, 1, 57, '2019-10-14 14:47:03', '2019-10-14 14:47:03');
INSERT INTO `gas_role_permission` VALUES (94, 1, 66, '2019-10-14 14:47:03', '2019-10-14 14:47:03');
INSERT INTO `gas_role_permission` VALUES (95, 2, 57, '2019-10-14 14:47:12', '2019-10-14 14:47:12');
INSERT INTO `gas_role_permission` VALUES (96, 1, 62, '2019-10-14 14:56:43', '2019-10-14 14:56:43');
INSERT INTO `gas_role_permission` VALUES (97, 1, 70, '2019-10-14 14:56:43', '2019-10-14 14:56:43');
INSERT INTO `gas_role_permission` VALUES (98, 1, 71, '2019-10-14 14:56:43', '2019-10-14 14:56:43');
INSERT INTO `gas_role_permission` VALUES (99, 2, 70, '2019-10-14 14:57:14', '2019-10-14 14:57:14');
INSERT INTO `gas_role_permission` VALUES (100, 2, 71, '2019-10-14 14:57:14', '2019-10-14 14:57:14');
INSERT INTO `gas_role_permission` VALUES (101, 3, 67, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (102, 3, 68, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (103, 3, 69, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (104, 3, 70, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (105, 3, 71, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (106, 3, 72, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (107, 3, 73, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (108, 3, 74, '2019-10-14 14:57:34', '2019-10-14 14:57:34');
INSERT INTO `gas_role_permission` VALUES (109, 3, 75, '2019-10-16 13:10:41', '2019-10-16 13:10:41');
INSERT INTO `gas_role_permission` VALUES (110, 2, 76, '2019-10-18 10:04:25', '2019-10-18 10:04:25');
INSERT INTO `gas_role_permission` VALUES (111, 2, 77, '2019-10-18 10:04:25', '2019-10-18 10:04:25');
INSERT INTO `gas_role_permission` VALUES (112, 3, 78, '2019-11-01 17:07:01', '2019-11-01 17:07:01');
INSERT INTO `gas_role_permission` VALUES (113, 3, 79, '2019-11-01 17:07:08', '2019-11-01 17:07:08');
INSERT INTO `gas_role_permission` VALUES (114, 2, 78, '2019-11-01 17:07:31', '2019-11-01 17:07:31');
INSERT INTO `gas_role_permission` VALUES (115, 2, 79, '2019-11-01 17:07:31', '2019-11-01 17:07:31');
INSERT INTO `gas_role_permission` VALUES (116, 1, 78, '2019-11-01 17:07:41', '2019-11-01 17:07:41');
INSERT INTO `gas_role_permission` VALUES (117, 1, 79, '2019-11-01 17:07:41', '2019-11-01 17:07:41');
COMMIT;

-- ----------------------------
-- Table structure for gas_staff
-- ----------------------------
DROP TABLE IF EXISTS `gas_staff`;
CREATE TABLE `gas_staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '员工姓名',
  `mobile` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '员工手机号',
  `card_no` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '员工身份证号',
  `job_number` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '员工工号',
  `job` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '员工职务',
  `jurisdiction` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '员工负责辖区',
  `photo` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '员工工作照',
  `sex` int DEFAULT '1' COMMENT '员工性别',
  `status` int DEFAULT '1' COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `gas_company_id` int DEFAULT NULL,
  `gas_region_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gas_company_id` (`gas_company_id`),
  KEY `gas_region_id` (`gas_region_id`),
  CONSTRAINT `gas_staff_ibfk_1` FOREIGN KEY (`gas_company_id`) REFERENCES `gas_company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `gas_staff_ibfk_2` FOREIGN KEY (`gas_region_id`) REFERENCES `gas_region` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1666 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for gas_user
-- ----------------------------
DROP TABLE IF EXISTS `gas_user`;
CREATE TABLE `gas_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '姓名',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '手机号',
  `is_init_pwd` int DEFAULT '1' COMMENT '是否是初始化密码',
  `is_super` int DEFAULT '0' COMMENT '是否是超级管理员',
  `type` int DEFAULT '1' COMMENT '用户类型：1省级管理员2市级管理员3公司管理员',
  `status` int DEFAULT '1' COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `gas_region_id` int DEFAULT NULL,
  `gas_company_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_user
-- ----------------------------
BEGIN;
INSERT INTO `gas_user` VALUES (1, 'admin', '$2a$10$FUE3xiDx3gbzld3tXUS9..bZybuec9zlj67uk2o.kUNa13zf8.FeG', '超级管理员', '', 0, 1, 0, 1, '2019-07-25 09:22:12', '2021-01-06 09:38:36', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for gas_user_role
-- ----------------------------
DROP TABLE IF EXISTS `gas_user_role`;
CREATE TABLE `gas_user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gas_user_id` int DEFAULT NULL,
  `gas_role_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gas_user_role_gasUserId_gasRoleId_unique` (`gas_user_id`,`gas_role_id`),
  UNIQUE KEY `gas_user_role_gasRoleId_userId_unique` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of gas_user_role
-- ----------------------------
BEGIN;
INSERT INTO `gas_user_role` VALUES (1, NULL, 1, '2019-10-14 08:22:32', '2019-10-14 08:22:32', 2);
INSERT INTO `gas_user_role` VALUES (2, 2, 1, '2019-10-14 09:41:00', '2019-10-14 09:41:00', NULL);
INSERT INTO `gas_user_role` VALUES (3, 6, 2, '2019-10-14 10:37:38', '2019-10-14 10:37:38', NULL);
INSERT INTO `gas_user_role` VALUES (4, 7, 2, '2019-10-14 10:37:38', '2019-10-14 10:37:38', NULL);
INSERT INTO `gas_user_role` VALUES (9, 12, 1, '2019-10-18 08:40:13', '2019-10-18 08:40:13', NULL);
INSERT INTO `gas_user_role` VALUES (10, 13, 2, '2019-10-18 08:41:25', '2019-10-18 08:41:25', NULL);
INSERT INTO `gas_user_role` VALUES (12, 15, 3, '2019-11-01 10:32:08', '2019-11-01 10:32:08', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

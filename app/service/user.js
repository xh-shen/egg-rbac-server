'use strict';
const Service = require('egg').Service;
const bcrypt = require('bcryptjs');

class UserService extends Service {
  async show(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const user = await ctx.model.User.findOne({
      where: { id },
      attributes: { exclude: [ 'password', 'updatedAt' ] },
      include: [
        {
          through: { attributes: [] },
          model: ctx.model.Role,
          as: 'roles',
          attributes: [ 'id', 'name' ],
          where: { status: 1 },
          required: false,
        },
      ],
    });
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    const roles = user.getDataValue('roles');
    user.setDataValue('roleIds', roles.map(item => item.id));
    return user;
  }

  async info() {
    const {
      ctx,
      app: { Sequelize },
    } = this;
    const { id, type, gasCompanyId } = ctx.state.user;
    const user = await ctx.model.User.findOne({
      where: { id },
      // attributes: { exclude: [ 'password', 'updatedAt' ] },
      attributes: [
        'id',
        'username',
        'type',
        'name',
        'phone',
        'gasCompanyId',
        'gasRegionId',
        'isInitPwd',
        'createdAt',
        'status',
        'isSuper',
        'statusName',
        [ Sequelize.col('region.name'), 'regionName' ],
        [ Sequelize.col('company.name'), 'companyName' ],
      ],
      include: [
        {
          through: { attributes: [] },
          model: ctx.model.Role,
          as: 'roles',
          attributes: [ 'id', 'name' ],
          required: false,
        },
        {
          model: ctx.model.Region,
          as: 'region',
          attributes: [],
        },
        {
          model: ctx.model.Company,
          as: 'company',
          attributes: [],
        },
      ],
    });
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    let company;
    if (type === 3) {
      company = await ctx.model.Company.findOne({
        where: { id: gasCompanyId },
        attributes: [
          'id',
          'name',
          'mobile',
          'contacts',
          'contactsMobile',
          'email',
          'website',
          'status',
          'statusName',
          'createdAt',
          [ Sequelize.col('region.name'), 'regionName' ],
        ],
        include: [
          {
            model: ctx.model.Region,
            as: 'region',
            attributes: [],
          },
        ],
      });
    }
    let permissions;
    if (user.isSuper) {
      user.setDataValue('roleName', '超级管理员');
      permissions = await this.superPermission(user);
    } else {
      const roles = JSON.parse(JSON.stringify(user.getDataValue('roles')));
      if (roles.length === 0) {
        permissions = {
          routes: [],
          operations: [],
        };
      } else {
        const roleArr = ctx.helper.unique(roles, 'id');
        user.setDataValue('roleName', roleArr.map(item => item.name).join(','));
        permissions = await this.otherPermission(roleArr.map(item => item.id));
      }
    }
    return {
      user,
      company,
      ...permissions,
    };
  }

  async index(payload) {
    const {
      ctx,
      app: { Sequelize },
    } = this;
    const { Op } = Sequelize;
    const { type, gasRegionId } = ctx.state.user;
    const page = ctx.helper.parseInt(payload.page) || 1;
    const limit = ctx.helper.parseInt(payload.limit) || 10;
    const offset = (page - 1) * limit;
    const { id } = ctx.state.user;
    const where = {
      isSuper: {
        [Op.ne]: 1,
      },
      id: {
        [Op.ne]: id,
      },
      [Op.or]: [
        {
          username: {
            [Op.like]: `%${payload.keyword}%`,
          },
        },
        {
          name: {
            [Op.like]: `%${payload.keyword}%`,
          },
        },
        {
          '$company.name$': {
            [Op.like]: `%${payload.keyword}%`,
          },
        },
      ],
    };
    if (payload.status) {
      where.status = payload.status;
    }
    if (type === 1) {
      where.type = 2;
    } else if (type === 2) {
      where.type = 3;
      where.gasRegionId = gasRegionId;
    }
    const users = await this.ctx.model.User.findAndCountAll({
      offset,
      limit,
      order: [[ 'createdAt', 'DESC' ]],
      attributes: [
        'id',
        'username',
        'name',
        'phone',
        'status',
        'statusName',
        [ Sequelize.col('company.name'), 'companyName' ],
      ],
      distinct: type === 2,
      where,
      include: [
        {
          model: ctx.model.Company,
          as: 'company',
          attributes: [],
        },
      ],
    });
    return {
      total: users.count,
      list: users.rows,
    };
  }

  async create(body) {
    const { ctx, app } = this;
    const { type, gasRegionId } = ctx.state.user;
    const user1 = await ctx.model.User.findOne({
      where: {
        username: body.username,
      },
    });
    if (user1) {
      ctx.throw(409, '用户名已存在');
    }
    if (ctx.helper.parseInt(body.isSuper) === 1) {
      ctx.throw(409, '你要搞事情？？？');
    }

    let _body;
    if (type === 0) {
      _body = Object.assign({}, body, {
        type: 1,
        roleIds: [ 1 ],
        gasRegionId: null,
        gasCompanyId: null,
      });
      const user = await ctx.model.User.findOne({
        where: {
          type: 1,
        },
      });

      if (user) {
        ctx.throw(409, '已有省政数局账号，不可重复创建');
      }
    } else if (type === 1) {
      _body = Object.assign({}, body, {
        type: 2,
        roleIds: [ 2 ],
        gasCompanyId: null,
      });
      const region = await ctx.model.Region.findByPk(
        ctx.helper.parseInt(_body.gasRegionId)
      );
      if (!region) {
        ctx.throw(404, '地区不存在，不能创建账号！');
      }
      const user = await ctx.model.User.findOne({
        where: {
          type: 2,
          gasRegionId: ctx.helper.parseInt(_body.gasRegionId),
        },
      });

      if (user) {
        ctx.throw(409, '该地区已有账号，不可重复创建');
      }
    } else if (type === 2) {
      _body = Object.assign({}, body, {
        type: 3,
        roleIds: [ 3 ],
        gasRegionId,
      });
      const region = await ctx.model.Region.findByPk(
        ctx.helper.parseInt(_body.gasRegionId)
      );
      if (!region) {
        ctx.throw(404, '地区不存在，不能创建账号！');
      }
      const company = await ctx.model.Company.findByPk(
        ctx.helper.parseInt(_body.gasCompanyId)
      );
      if (!company) {
        ctx.throw(404, '公司不存在，不能创建账号！');
      }
      const user = await ctx.model.User.findOne({
        where: {
          type: 3,
          gasCompanyId: ctx.helper.parseInt(_body.gasCompanyId),
        },
      });

      if (user) {
        ctx.throw(409, '该公司已有账号，不可重复创建');
      }
    } else {
      ctx.throw(409, '非法操作！');
    }

    _body.password = this.config.initPwd;

    const id = await app.model.transaction({}, async transaction => {
      const roles = await ctx.model.Role.findAll({
        where: { id: _body.roleIds },
        transaction,
      });
      const user = await ctx.model.User.create(_body, { transaction });
      await user.setRoles(roles, { transaction });
      return user.id;
    });

    return { id };
  }

  async update(_id, body) {
    const {
      ctx,
      app: {
        Sequelize: { Op },
      },
    } = this;
    const id = ctx.helper.parseInt(_id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    if (ctx.helper.parseInt(body.isSuper) === 1) {
      ctx.throw(409, '你要搞事情？？？');
    }
    const { type, gasRegionId } = ctx.state.user;
    if (type === 1) {
      const user = await ctx.model.User.findOne({
        where: {
          id: {
            [Op.ne]: id,
          },
          type: 2,
          gasRegionId: ctx.helper.parseInt(body.gasRegionId),
        },
      });
      if (user) {
        ctx.throw(409, '该地区已有账号，不可重复创建');
      }
    }
    if (type === 2) {
      const user = await ctx.model.User.findOne({
        where: {
          id: {
            [Op.ne]: id,
          },
          type: 3,
          gasCompanyId: ctx.helper.parseInt(body.gasCompanyId),
        },
      });
      if (user) {
        ctx.throw(409, '该公司已有账号，不可重复创建');
      }
    }
    if (user.gasRegionId !== body.gasRegionId) {
      const company = await ctx.model.Company.count({
        gasRegionId: user.gasRegionId,
      });
      if (company > 0) {
        ctx.throw(409, '该地区用户下已有公司，无法修改地区！');
      }
    }

    if (user.gasCompanyId !== body.gasCompanyId) {
      const staff = await ctx.model.Staff.count({
        where: {
          gasCompanyId: user.gasCompanyId,
        },
      });

      if (staff > 0) {
        ctx.throw(409, '该公司用户下已有员工，无法修改公司！');
      }
    }
    await user.update({
      gasCompanyId: type === 2 ? body.gasCompanyId : null,
      gasRegionId:
        type === 1 ? body.gasRegionId : type === 2 ? gasRegionId : null,
      name: body.name,
      phone: body.phone,
      status: body.status,
      type: type === 0 ? 1 : type === 1 ? 2 : 3,
    });
    return null;
  }

  async destroy(_id) {
    const { ctx, app } = this;
    const id = ctx.helper.parseInt(_id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    if (user.gasRegionId && !user.gasCompanyId) {
      const company = await ctx.model.Company.count({
        gasRegionId: user.gasRegionId,
      });
      if (company > 0) {
        ctx.throw(409, '该地区用户下已有公司，无法删除！');
      }
    }
    if (user.gasCompanyId) {
      const staff = await ctx.model.Staff.count({
        where: {
          gasCompanyId: user.gasCompanyId,
        },
      });

      if (staff > 0) {
        ctx.throw(409, '该公司用户下已有员工，无法删除！');
      }
    }
    await app.model.transaction({}, async transaction => {
      await user.destroy({}, { transaction });
      await user.setRoles([], { transaction });
    });
    return null;
  }

  async destroyMult(ids) {
    const { ctx, app } = this;
    await app.model.transaction({}, async transaction => {
      await ctx.model.User.destroy({ where: { id: ids } }, { transaction });
      await ctx.model.UserRole.destroy(
        { where: { gasUserId: ids } },
        { transaction }
      );
    });
    return null;
  }

  async editPassword(body) {
    const { ctx } = this;
    const id = ctx.state.user.id;
    const user = await ctx.model.User.findOne({
      where: { id },
    });
    if (body.oldPassword === '' || body.newPassword === '') {
      ctx.throw(422, '旧密码与新密码必须填写');
    }
    // if (
    //   !/((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,16}$/.test(
    //     body.newPassword
    //   )
    // ) {
    //   ctx.throw(422, '密码必须是8-16位数字、字母或符号的两者结合');
    // }
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    const correct = bcrypt.compareSync(body.oldPassword, user.password);
    if (!correct) {
      ctx.throw(401, '原密码错误');
    }

    await user.update({ password: body.newPassword, isInitPwd: 0 });
    return null;
  }

  async all() {
    const { ctx, app } = this;
    const users = await ctx.model.User.findAll({
      where: {
        status: 1,
        isSuper: {
          [app.Sequelize.Op.ne]: 1,
        },
      },
      attributes: [ 'id', 'username', 'name' ],
    });
    return users;
  }

  async resetPwd(_id) {
    const { ctx } = this;
    const id = ctx.helper.parseInt(_id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    const password = this.config.initPwd;
    await user.update({ password });
    return null;
  }

  async superPermission() {
    const { service } = this;
    const menus = await service.menu.getMenuRedis();
    const elements = await service.element.getElementRedis();
    const routes = menus.filter(item => item.status);
    const operations = elements
      .filter(item => item.status)
      .map(item => item.code);
    return {
      routes,
      operations,
    };
  }

  async otherPermission(roleIds) {
    const { ctx, app, service } = this;
    let permissions = [];
    for (let i = 0; i < roleIds.length; i++) {
      const r = await app.redis.get(`gas_role${roleIds[i]}`);
      if (r) {
        permissions.push(...JSON.parse(r));
      } else {
        const role = await ctx.model.Role.findByPk(roleIds[i]);
        const rolePermissions = await role.getPermissions();
        if (rolePermissions.length > 0) {
          const temp = await service.role.setRolePermissionRedis(
            roleIds[i],
            rolePermissions
          );
          permissions.push(...JSON.parse(temp));
        }
      }
    }
    permissions = [ ...new Set(permissions.map(item => item.id)) ];
    const menus = await service.menu.getMenuRedis();
    const elements = await service.element.getElementRedis();
    const routes = menus.filter(
      item =>
        !item.isSuper &&
        item.status &&
        permissions.includes(item.gasPermissionId)
    );
    const operations = elements
      .filter(item => item.status && permissions.includes(item.gasPermissionId))
      .map(item => item.code);
    return {
      routes,
      operations,
    };
  }

  async editInfo(body) {
    const { ctx } = this;

    const { type, id } = ctx.state.user;
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      ctx.throw(404, '用户不存在');
    }
    await user.update({
      name: type === 1 || type === 2 ? body.name : '',
      phone: body.phone,
    });
    return null;
  }
}

module.exports = UserService;

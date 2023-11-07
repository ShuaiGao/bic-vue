<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  GetRoles,
  GetRole,
  IResponseGetRole,
  IResponseRoles,
  IRoleItem,
  IPageItem,
  IRouteNode
} from "@/api/admin.pb";
import { Response } from "@/utils/axiosReq";
import { getTimeStr } from "@/utils/time";
import { Select } from "@element-plus/icons-vue";

defineOptions({
  name: "PermissionPage"
});

interface IRoleTreeItem extends IRoleItem {
  children?: IRoleTreeItem[];
}

const showTree = ref(true);
const roleList = ref<IRoleItem[]>([]);
const roleTreeList = ref<IRoleTreeItem[]>([]);
const role = ref<IResponseGetRole>();
const selectMenuItem = ref<IRouteNode>();
const pageItemList = ref<IPageItem[]>([]);
const menuDefaultOpenId = ref<string[]>([]);
// const menuRenameShow = ref(false);
// const menuRenameId = ref("");

const getRoleList = () => {
  console.log("get role list");
  GetRoles().then((res: Response<IResponseRoles>) => {
    console.log("get role list result ", res);
    if (res.code !== 0) {
      return;
    }
    console.log(res.data.data_list);
    roleList.value = res.data.data_list;
    console.log(roleList);
    roleTreeList.value = genTreeItemList(res.data.data_list);
    console.log("role tree list: ", roleTreeList.value);
    if (roleTreeList.value.length > 0) {
      onRoleNodeClick(undefined, roleTreeList.value[0]);
    }
  });
};

function genTreeItemList(itemList: IRoleTreeItem[]): IRoleTreeItem[] {
  if (!itemList || itemList.length == 0) {
    return [];
  }
  const retList = [] as IRoleTreeItem[];
  const roleMap = new Map<number, IRoleTreeItem>();
  itemList.forEach(e => {
    roleMap.set(e.id, e);
    if (!e.father_id || e.father_id == 0) {
      retList.push(e);
    }
  });
  itemList.forEach(e => {
    const father = roleMap.get(e.father_id);
    if (father) {
      father.children = father.children ?? [];
      father.children.push(e);
    }
  });
  return retList;
}

const onChangeShow = () => {
  showTree.value = !showTree.value;
};

const onRoleNodeClick = (_: any, node: IRoleTreeItem) => {
  GetRole(node.id).then((res: Response<IResponseGetRole>) => {
    role.value = res.data;
    console.log(res.data);
    if (res.data && res.data.route_list && res.data.route_list.length > 0) {
      menuDefaultOpenId.value = [res.data.route_list[0].id];
    }
  });
};

// const onRouteNodeClick = (_: any, node: IRoleTreeItem) => {
//   console.log("点击路由节点");
//   // GetRole(node.id).then((res: Response<IResponseGetRole>) => {
//   //   role.value = res.data;
//   //   console.log(res.data)
//   // });
// };

const onMenuClick = (menu_id: string, menuNode: IRouteNode) => {
  selectMenuItem.value = menuNode;
  pageItemList.value = menuNode.items;
};

// const onMenuItemRename = (id: string) => {
//   menuRenameShow.value = true;
//   menuRenameId.value = id;
// };

const onItemSelectAll = (flag: boolean) => {
  for (let i = 0; i < pageItemList.value.length; i++) {
    pageItemList.value[i].checked = flag;
  }
};

const onItemClick = (id: string) => {
  for (let i = 0; i < pageItemList.value.length; i++) {
    if (pageItemList.value[i].id === id) {
      pageItemList.value[i].checked = !pageItemList.value[i].checked;
    }
  }
  console.log("item select", pageItemList.value, id);
  // console.log("menu select", items);
  // if (items && items.length > 0) {
  //   pageItemList.value = items;
  // }
};

enum EMenuStatus {
  none = 0,
  select = 1,
  semi = 2,
  close = 3
}

const handleOpen = (index: any) => {
  console.log("menu open ", index);
  console.log("menu open ", menuDefaultOpenId);
};

const getMenuStatus = (menu: IRouteNode): EMenuStatus => {
  if (menu.children && menu.children.length > 0) {
    return EMenuStatus.none;
    // let checkNum = 0;
    // menu.children.forEach(e => {
    //   checkNum += e.checked ? 1 : 0;
    // });
  } else if (menu.items && menu.items.length > 0) {
    let checkNum = 0;
    menu.items.forEach(e => {
      checkNum += e.checked ? 1 : 0;
    });
    if (checkNum == 0) {
      return EMenuStatus.close;
    } else if (checkNum == menu.items.length) {
      return EMenuStatus.select;
    } else {
      return EMenuStatus.semi;
    }
  }
  return EMenuStatus.close;
};

onMounted(() => {
  getRoleList();
});

const defaultProps = {
  children: "children",
  label: "name"
};
</script>

<template>
  <div class="space">
    <el-row>
      <el-button type="primary" v-if="showTree" @click="onChangeShow"
        >树状显示
      </el-button>
      <el-button type="primary" v-if="!showTree" @click="onChangeShow"
        >表格显示
      </el-button>
      <el-button type="primary">创建角色</el-button>
    </el-row>
    <el-row>
      <el-table
        v-if="!showTree"
        :data="roleList"
        border
        style="width: 100%"
        :fit="true"
      >
        <el-table-column prop="id" label="#" min-width="40" />
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="father_id" label="父角色ID" min-width="100" />
        <el-table-column prop="father_name" label="父角色" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="create_time" label="创建时间" min-width="100">
          <template #default="scope">
            {{ getTimeStr(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="create_user" label="创建人" />
        <el-table-column prop="update_time" label="更新时间" min-width="100">
          <template #default="scope">
            {{ getTimeStr(scope.row.update_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="更新人" />
        <el-table-column label="操作" min-width="100">
          <template #default>
            <el-button type="primary" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col v-else>
        <el-row justify="center" :gutter="10">
          <el-col :span="4">
            <el-tree
              :data="roleTreeList"
              :props="defaultProps"
              :default-expand-all="true"
              @node-click="onRoleNodeClick"
              width="100%"
            />
          </el-col>
          <el-col :span="20">
            角色详细信息
            <el-row :gutter="10">
              <el-col :span="6">
                <el-menu
                  default-active="xxxxx"
                  :default-openeds="menuDefaultOpenId"
                  @open="handleOpen"
                >
                  <el-sub-menu
                    :index="menu.id"
                    v-bind:key="menu.id"
                    v-for="menu in role?.route_list ?? []"
                  >
                    <template #title>
                      <el-icon>
                        <location />
                      </el-icon>
                      <span>{{ menu.label }}</span>
                    </template>
                    <template v-for="item in menu.children ?? []">
                      <el-sub-menu
                        index="{{item.id}}"
                        v-bind:key="item.id"
                        v-if="item.children && item.children.length > 0"
                      >
                        <template #title>
                          <span>{{ item.label }}</span>
                          <el-icon
                            v-if="getMenuStatus(menu) === EMenuStatus.select"
                            ><Select
                          /></el-icon>
                          <el-icon
                            v-else-if="getMenuStatus(menu) === EMenuStatus.semi"
                          >
                            <SemiSelect />
                          </el-icon>
                          <el-icon
                            v-else-if="
                              getMenuStatus(menu) === EMenuStatus.close
                            "
                          >
                            <CloseBold />
                          </el-icon>
                        </template>
                      </el-sub-menu>
                      <el-menu-item
                        v-bind:key="item.id"
                        index="{{item.id}}"
                        v-else
                        @click="onMenuClick(item.id, item)"
                        >{{ item.label }}
                        <el-icon
                          v-if="getMenuStatus(menu) === EMenuStatus.select"
                          ><Select
                        /></el-icon>
                        <el-icon
                          v-else-if="getMenuStatus(menu) === EMenuStatus.semi"
                        >
                          <SemiSelect />
                        </el-icon>
                        <el-icon
                          v-else-if="getMenuStatus(menu) === EMenuStatus.close"
                        >
                          <CloseBold />
                        </el-icon>
                      </el-menu-item>
                    </template>
                  </el-sub-menu>
                </el-menu>
              </el-col>
              <el-col :span="18">
                <el-row style="padding: 20px 10px; background-color: #ddd">
                  <el-col>
                    <el-row> 快捷操作</el-row>
                    <el-row>
                      <el-button @click="onItemSelectAll(true)" type="success"
                        >全选
                      </el-button>
                      <el-button @click="onItemSelectAll(false)" type="info"
                        >全不选
                      </el-button>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row style="padding: 20px 10px; background-color: #ddd">
                  <el-col>
                    <el-row> 路由详情信息</el-row>
                    <el-row>
                      <el-button
                        :type="item.checked ? 'primary' : ''"
                        v-for="item in pageItemList"
                        v-bind:key="item.id"
                        :icon="Select"
                        @click="onItemClick(item.id)"
                      >
                        {{ item.label }}
                      </el-button>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row style="padding: 20px 10px; background-color: #ddd">
                  <el-button :type="'success'">保存权限修改</el-button>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
.space {
  margin: 10px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>

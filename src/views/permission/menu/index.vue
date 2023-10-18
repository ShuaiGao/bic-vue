<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Response } from "@/utils/axiosReq";
import { GetMenus, IMenuItem, IResponseGetMenus } from "@/api/admin.pb";
import { Edit, Delete } from "@element-plus/icons-vue";

defineOptions({
  name: "PermissionButton"
});
const menuList = ref<IMenuItem[]>([]);
const selectMenu = ref<IMenuItem>();

const getMenuList = () => {
  GetMenus().then((e: Response<IResponseGetMenus>) => {
    console.log(e);
    menuList.value = e.data.route_list;
  });
};

onMounted(() => {
  getMenuList();
});

const getHttpMethodType = (method: string): string => {
  if (method === "GET") {
    return "success";
  } else if (method === "POST") {
    return "primary";
  } else if (method === "PATCH") {
    return "warning";
  } else if (method === "DELETE") {
    return "danger";
  }
  return "info";
};
const onNodeClick = (_: any, node: any) => {
  console.log(node);
  selectMenu.value = node.data;
};
const defaultProps = {
  children: "children",
  label: "label"
};
</script>

<template>
  <el-row :gutter="10">
    <el-col :lg="6" :xs="10" :sm="10" :md="8">
      <el-tree
        :data="menuList"
        show-checkbox
        :highlight-current="true"
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :props="defaultProps"
        :default-expand-all="true"
        @node-click="onNodeClick"
        draggable
      />
    </el-col>
    <el-row :span="18" :xs="14" :sm="14" :md="16">
      <el-col>
        <el-row> 界面权限详情，菜单顺序可通过拖拽操作调整</el-row>
        <el-row class="m-2">
          <el-button type="primary">重命名菜单</el-button>
          <el-button type="primary">添加行为权限</el-button>
          <el-button type="danger">删除菜单</el-button>
        </el-row>
        <el-row :gutter="10">
          <el-space
            wrap
            v-bind:key="item.id"
            v-for="item in selectMenu?.items ?? []"
            :span="12"
            style="margin-bottom: 10px"
          >
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <el-text tag="b">{{ item.label }}</el-text>
                  <el-text class="mx-1 ml-4"> id: {{ item.id }}</el-text>
                  <el-button
                    type="primary"
                    class="ml-3"
                    size="small"
                    :icon="Edit"
                  />
                  <el-button
                    type="danger"
                    style="margin-left: 2px"
                    :icon="Delete"
                    size="small"
                  />
                </div>
              </template>
              <div
                v-bind:key="method.method + method.url"
                v-for="method in item.methods"
              >
                <el-text class="mx-1" :type="getHttpMethodType(method.method)">
                  {{ method.method }}
                </el-text>
                {{ method.url }}
              </div>
            </el-card>
          </el-space>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

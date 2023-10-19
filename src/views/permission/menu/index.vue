<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Response } from "@/utils/axiosReq";
import {
  GetMenus,
  IMenuItem,
  IResponseGetMenus,
  IRequestPostMenuPageAction,
  EMenuItemType
} from "@/api/admin.pb";
import { Edit, Delete, Plus, Minus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { md5 } from "js-md5";

defineOptions({
  name: "PermissionButton"
});

const dialogAddVisible = ref(false);
const menuList = ref<IMenuItem[]>([]);
const selectMenu = ref<IMenuItem>();
const formAddPageAction = ref<IRequestPostMenuPageAction>({
  id: "",
  label: "",
  methods: [{ method: "", url: "", note: "" }]
});

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

const onSavePageItem = () => {
  console.log("保存成功");
  ElMessage({
    message: "保存成功",
    type: "success"
  });
};

const onAddLineItem = () => {
  formAddPageAction.value.methods.push({
    method: "",
    url: "",
    note: ""
  });
};

const onDeleteLineItem = (index: number) => {
  formAddPageAction.value.methods.splice(index, 1);
};

const onFormClear = () => {
  formAddPageAction.value = {
    id: "",
    label: "",
    methods: [{ method: "", url: "", note: "" }]
  };
};

const onGenID = () => {
  const hash = md5.create();
  hash.update(new Date().getUTCMilliseconds() + "");
  formAddPageAction.value.id = hash.hex();
};
</script>

<template>
  <el-dialog v-model="dialogAddVisible" title="添加操作（行为）" width="40%">
    <el-form :model="formAddPageAction">
      <el-row>
        <el-col :span="10" class="mr-3">
          <el-form-item label="id" label-width="40px">
            <el-input
              v-model="formAddPageAction.id"
              autocomplete="off"
              readonly
            />
          </el-form-item>
          <el-form-item label="label" label-width="40px">
            <el-input v-model="formAddPageAction.label" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button size="default" type="primary" @click="onGenID"
            >生成ID
          </el-button>
        </el-col>
      </el-row>
      <el-divider content-position="left">行为对应接口</el-divider>
      <template
        v-bind:key="item.method + item.url"
        v-for="(item, index) in formAddPageAction.methods ?? []"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="接口">
              <el-select v-model="item.method">
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PATCH" value="PATCH" />
                <el-option label="DELETE" value="DELETE" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="url">
              <el-input v-model="item.url" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: right">
            <el-button
              size="small"
              type="primary"
              :icon="Minus"
              @click="onDeleteLineItem(index)"
            />
          </el-col>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input v-model="item.note" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="mb-3" />
      </template>
      <el-row justify="center">
        <el-button
          type="primary"
          :icon="Plus"
          style="width: 100px"
          @click="onAddLineItem"
        />
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="onFormClear">清空内容</el-button>
        <el-button @click="dialogAddVisible = false">取消</el-button>
        <el-button
          type="primary"
          style="width: 120px"
          @click="dialogAddVisible = false"
        >
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>
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
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }} {{ node.menu_item_type }}</span>
            <el-icon
              v-if="data.menu_item_type == EMenuItemType.MenuItemType_folder"
            >
              <Folder />
            </el-icon>
            <el-icon
              v-if="data.menu_item_type == EMenuItemType.MenuItemType_document"
            >
              <Document />
            </el-icon>
          </span>
        </template>
      </el-tree>
    </el-col>
    <el-row :span="18" class="m-3" :xs="14" :sm="14" :md="16">
      <el-col>
        <el-row> 界面权限详情，菜单顺序可通过拖拽操作调整</el-row>
        <el-row class="m-2">
          <el-button type="primary" @click="dialogAddVisible = true"
            >重命名菜单
          </el-button>
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
                    type="danger"
                    style="float: right"
                    :icon="Delete"
                    size="small"
                  />
                  <el-button
                    type="primary"
                    size="small"
                    :icon="Edit"
                    style="float: right; margin-right: 4px"
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
        <el-row class="m-2">
          <el-button type="primary" @click="onSavePageItem">保存</el-button>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

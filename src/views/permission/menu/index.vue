<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Response } from "@/utils/axiosReq";
import type Node from "element-plus/es/components/tree/src/model/node";
import {
  EMenuItemType,
  GetMenus,
  IMenuItem,
  IRequestPostMenuPageAction,
  IResponseGetMenus
} from "@/api/admin.pb";
import {
  Delete,
  Edit,
  Minus,
  Plus,
  Folder,
  Document
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { md5 } from "js-md5";

defineOptions({
  name: "PermissionButton"
});

interface FormRename {
  id: string;
  name: string;
}

interface FormAddTreeItem {
  id: string;
  label: string;
  item_type: EMenuItemType;
}

const dialogAddTreeItemVisible = ref(false);
const dialogRenameVisible = ref(false);
const dialogAddVisible = ref(false);
const menuList = ref<IMenuItem[]>([]);
const selectMenu = ref<IMenuItem>();
const formAddPageAction = ref<IRequestPostMenuPageAction>({
  id: "",
  label: "",
  methods: [{ method: "", url: "", note: "" }]
});
const formRename = ref<FormRename>({
  id: "",
  name: ""
});
const formAddTreeItem = ref<FormAddTreeItem>({
  id: "",
  label: "",
  item_type: EMenuItemType.MenuItemType_folder
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
  formRename.value.id = node.data.id;
  formRename.value.name = node.data.label;
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

const onRenameEx = (ItemList: IMenuItem[]): boolean => {
  let find = false;
  for (let i = 0; i < ItemList.length; i++) {
    if (ItemList[i].id == formRename.value.id) {
      find = true;
      ItemList[i].label = formRename.value.name;
      break;
    }
    if (!menuList.value[i].children) {
      continue;
    }
    find = onRenameEx(menuList.value[i].children);
    if (find) break;
  }
  return find;
};
const onRename = () => {
  const find = onRenameEx(menuList.value);
  if (find) {
    dialogRenameVisible.value = false;
  } else {
    ElMessage({
      message: "查找菜单id错误",
      type: "warning"
    });
  }
};

const onAddTreeItem = () => {
  menuList.value.push({
    id: formAddTreeItem.value.id,
    label: formAddTreeItem.value.label,
    menu_item_type: formAddTreeItem.value.item_type
  });
  ElMessage({
    message: "添加成功",
    type: "success"
  });
  dialogAddTreeItemVisible.value = false;
};

const allowDrop = (draggingNode: Node, dropNode: Node): boolean => {
  return dropNode.data.menu_item_type !== EMenuItemType.MenuItemType_document;
};
</script>

<template>
  <el-dialog v-model="dialogAddTreeItemVisible" title="新建菜单" width="400px">
    <el-form :model="formAddTreeItem">
      <el-form-item label="id" label-width="40px">
        <el-input v-model="formAddTreeItem.id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="label" label-width="40px">
        <el-input v-model="formAddTreeItem.label" autocomplete="off" />
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-radio-group v-model="formAddTreeItem.item_type">
          <el-radio :label="EMenuItemType.MenuItemType_folder">目录</el-radio>
          <el-radio :label="EMenuItemType.MenuItemType_document">页面</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogAddTreeItemVisible = false">取消</el-button>
        <el-button type="primary" style="width: 120px" @click="onAddTreeItem">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogRenameVisible" title="重命名菜单" width="40%">
    <el-form :model="formRename">
      <el-form-item label="id" label-width="40px">
        <el-input v-model="formRename.id" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item label="label" label-width="40px">
        <el-input v-model="formRename.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogRenameVisible = false">取消</el-button>
        <el-button type="primary" style="width: 120px" @click="onRename()">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
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
    <el-col :lg="6" :xs="10" :sm="10" :md="8" class="m-2">
      <el-tree
        :data="menuList"
        show-checkbox
        :highlight-current="true"
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :props="defaultProps"
        :default-expand-all="true"
        :allow-drop="allowDrop"
        @node-click="onNodeClick"
        draggable
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span :class="node.children ? 'node-err-wrap' : ''"
              >{{ node.label }} {{ node.menu_item_type }}</span
            >
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
    <el-col :span="18" class="m-3" :xs="14" :sm="14" :md="16">
      <el-col class="p-2">
        <el-row>
          <el-button
            type="primary"
            style="width: 100px"
            @click="dialogAddTreeItemVisible = true"
          >
            新建目录
          </el-button>
          <el-button
            type="primary"
            style="width: 100px"
            @click="dialogAddTreeItemVisible = true"
          >
            新建页面
          </el-button>
        </el-row>
        <el-row> 界面权限详情，菜单顺序可通过拖拽操作调整</el-row>
        <el-row>
          <el-button type="primary" @click="dialogRenameVisible = true"
            >重命名菜单
          </el-button>
          <el-button
            v-if="
              selectMenu?.menu_item_type == EMenuItemType.MenuItemType_document
            "
            type="primary"
            @click="dialogAddVisible = true"
            >添加行为权限
          </el-button>
          <el-button type="danger">删除菜单</el-button>
        </el-row>
        <el-row :gutter="10" class="mt-2">
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
        <el-row class="mt-2">
          <el-button type="primary" @click="onSavePageItem">保存</el-button>
        </el-row>
      </el-col>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GetRoles, IResponseRoles, IRoleItem } from "@/api/admin.pb";
import { Response } from "@/utils/axiosReq";
import { getTimeStr } from "@/utils/time";

defineOptions({
  name: "PermissionPage"
});

interface IRoleTreeItem extends IRoleItem {
  children?: IRoleTreeItem[];
}

const showTree = ref(false);
const roleList = ref<IRoleItem[]>([]);
const roleTreeList = ref<IRoleTreeItem[]>([]);

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

const onNodeClick = () => {
  console.log("node click;");
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
        <el-row justify="center">
          <el-col :span="6">
            <el-tree
              :data="roleTreeList"
              :props="defaultProps"
              @node-click="onNodeClick"
              width="100%"
            />
          </el-col>
          <el-col :span="18"> 角色详细信息 </el-col>
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

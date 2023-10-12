<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GetUsers, IRequestUsers, IUser, IResponseUsers } from "@/api/user.pb";
import { Response } from "@/utils/axiosReq";

defineOptions({
  name: "PermissionPage"
});

const showTree = ref(false);
const userList = ref<IUser[]>([]);
const requestParam = ref<IRequestUsers>({ page: 1, page_size: 10 });
const userTotal = ref(0);

const getUserList = () => {
  GetUsers(requestParam.value).then((res: Response<IResponseUsers>) => {
    if (res.code !== 0) {
      return;
    }
    userTotal.value = res.data.total;
    userList.value = res.data.data_list;
    console.log(userList);
  });
};

const onChangeShow = () => {
  showTree.value = !showTree.value;
};

onMounted(() => {
  getUserList();
});
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
      <el-table :data="userList" border style="width: 100%" :fit="true">
        <el-table-column prop="id" label="#" min-width="40" />
        <el-table-column prop="username" label="用户名" min-width="180" />
        <el-table-column prop="email" label="邮箱" min-width="100" />
        <!--        <el-table-column prop="father_name" label="父角色" />-->
        <!--        <el-table-column prop="remark" label="备注" />-->
        <!--        <el-table-column prop="create_time" label="创建时间" min-width="100">-->
        <!--          <template #default="scope">-->
        <!--            {{ getTimeStr(scope.row.create_time) }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column prop="create_user" label="创建人" />-->
        <!--        <el-table-column prop="update_time" label="更新时间" min-width="100">-->
        <!--          <template #default="scope">-->
        <!--            {{ getTimeStr(scope.row.update_time) }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column prop="update_user" label="更新人" />-->
        <el-table-column label="操作" min-width="100">
          <template #default>
            <el-button type="primary" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<style lang="scss">
.space {
  margin: 10px 10px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>

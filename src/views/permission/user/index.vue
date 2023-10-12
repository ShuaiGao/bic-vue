<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GetUsers, IRequestUsers, IUser, IResponseUsers } from "@/api/user.pb";
import { Response } from "@/utils/axiosReq";
import { getTimeStr } from "@/utils/time";

defineOptions({
  name: "PermissionUser"
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

const onSearch = () => {
  getUserList();
};
const onResetSearch = () => {
  requestParam.value = {
    page: requestParam.value.page,
    page_size: requestParam.value.page_size
  };
};

onMounted(() => {
  getUserList();
});

const handleSizeChange = (val: number) => {
  requestParam.value.page_size = val;
  getUserList();
};
const handleCurrentChange = (val: number) => {
  requestParam.value.page = val;
  getUserList();
};
</script>

<template>
  <div class="space">
    <el-row>
      <el-form :inline="true" :model="requestParam" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input
            v-model="requestParam.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="requestParam.email"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" size="small"
            >搜索</el-button
          >
          <el-button type="primary" @click="onResetSearch" size="small"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
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
        <el-table-column
          prop="update_time"
          label="最后活跃时间"
          min-width="100"
        >
          <template #default="scope">
            {{ getTimeStr(scope.row.update_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="update_user" label="是否禁用">
          <template #default="scope">
            <el-icon v-show="scope.row.ban" :size="20" color="red">
              <Remove />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template #default="scope">
            <el-button type="primary" size="small">修改</el-button>
            <el-button type="success" size="small" v-if="scope.row.ban"
              >启用</el-button
            >
            <el-button type="warning" size="small" v-else>禁用用户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row justify="end">
      <el-pagination
        :page-size="requestParam.page_size"
        :page-sizes="[10, 20, 30, 40]"
        :pager-count="5"
        :small="small"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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

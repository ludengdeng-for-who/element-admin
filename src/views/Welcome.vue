<template>
  <div class="welcome">
    <!-- <h3>Welcome admin System</h3> -->
    <h1>Welcome admin system</h1>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.welcome {
  position: relative;
  height: 100%;
  widows: 100%;
  background: url(./images/4-min.jpg);
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  h1 {
    font-size: 26px;
    position: absolute;
    animation: jump 2s infinite alternate linear;
  }
  @keyframes jump {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(10px);
    }
  }
}
</style>

---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  // VPTeamPageSection
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/86412303?s=96&v=4',
    name: '黄家俊',
    title: 'Vue3、TypeScript、Node',
    links: [
      { icon: 'github', link: 'https://github.com/Jon-a-than' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/74575471?s=96&v=4',
    name: '梁振胜',
    title: 'Vue、React、Java',
    links: [
      { icon: 'github', link: 'https://github.com/Lzzzs' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/108746194?s=96&v=4',
    name: '刘兴豪',
    title: 'Vue3、TypeScript、Golang',
    links: [
      { icon: 'github', link: 'https://github.com/030liuxinghao' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/81922999?s=96&v=4',
    name: '张洪浩',
    title: 'Vue2/3、Node、TypeScript',
    links: [
      { icon: 'github', link: 'https://github.com/Barry-Flynn' },
      { icon: 'twitter', link: 'https://twitter.com/BarryFlynn1024' },
      { icon: 'facebook', link: 'https://blog.meta-code.top' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/94176764?s=96&v=4',
    name: '杨鹏',
    title: 'Vue3、TypeScript、uni-app',
    links: [
      { icon: 'github', link: 'https://github.com/kitori7' }
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      我们的团队
    </template>
    <template #lead>
      本着对计算机技术的热爱与探索，
      Depazer 项目的初始团队均为中国高校学生，以下是本项目的核心成员。
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />

  <!-- 其他成员 -->
  <!-- 
  <VPTeamPageSection>
    <template #title>Partners</template>
    <template #lead>Lorem ipsum...</template>
    <template #members>
      <VPTeamMembers :members="members" />
    </template>
  </VPTeamPageSection>
   -->
</VPTeamPage>

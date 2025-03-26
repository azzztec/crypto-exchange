import { computed, makeAutoObservable, runInAction } from 'mobx'
import { coinsApiService, ICoin } from '@/shared/api'
import { RootStore } from '@/app/providers/rootStoreProvider'

export class CoinsStore {
  root: RootStore
  coins: Map<number, ICoin> = new Map()
  // coins: ICoin[] = []
  isLoading: boolean = false

  get allCoins() {
    return this.coins.values()
  }

  constructor(rootStore: RootStore) {
    this.root = rootStore
    makeAutoObservable(this, {}, { autoBind: true, deep: false })
    this.fetchCoins()
  }

  coinById(id: number) {
    return computed(() => this.coins.get(id)).get()
  }

  async fetchCoins() {
    this.isLoading = true
    const coins = await coinsApiService.fetchCoins()
    runInAction(() => {
      const map = new Map()
      coins.forEach((coin) => {
        map.set(coin.id, coin)
      })
      this.coins = map
      this.isLoading = false
    })
  }
}

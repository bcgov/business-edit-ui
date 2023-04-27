import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Products, ProductType } from '../../models/product'
import ProductService from '../../services/product.services'

@Module({
  name: 'product',
  namespaced: true
})
export default class ProductModule extends VuexModule {
  products: Products = []
  partners: Products = []

  @Mutation
  public setProducts (products: Products) {
    this.products = products
  }

  @Action({ rawError: true, commit: 'setProducts' })
  public async syncProducts () {
    const response = await ProductService.getAllProducts()
    if (response && response.data) {
      return response.data?.sort((a, b) => a.name.localeCompare(b.name))
    }
  }
}

package projeto_spring.pessoal.trabalho.Repository;

import org.springframework.stereotype.Repository;
import projeto_spring.pessoal.trabalho.model.Produto;

@Repository
public class ProdutoRepository {

    // Simulação de banco de dados
    private Produto produtoUnico = new Produto(1L, "Caixa Misteriosa Premium", 199.90, 5);

    public Produto buscarProdutoUnico() {
        return produtoUnico;
    }

    public void atualizarEstoque(int novoEstoque) {
        this.produtoUnico.setEstoque(novoEstoque);
    }
}
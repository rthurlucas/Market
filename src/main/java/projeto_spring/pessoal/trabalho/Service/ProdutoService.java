package projeto_spring.pessoal.trabalho.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projeto_spring.pessoal.trabalho.Repository.ProdutoRepository;
import projeto_spring.pessoal.trabalho.model.Produto;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    // Obtém um produto específico pelo ID
    public Produto obterProdutoPorId(Long id) {
        return repository.buscarProdutoPorId(id);
    }

    // Retorna o total de produtos no catálogo
    public int obterTotalProdutos() {
        return repository.totalProdutos();
    }

    public boolean processarCompra(Long id) {
        Produto produto = repository.buscarProdutoPorId(id);

        if (produto != null && produto.getEstoque() > 0) {
            // Regra de negócio: Diminuir estoque
            repository.atualizarEstoque(id, produto.getEstoque() - 1);
            return true; // Compra aprovada
        }
        return false; // Sem estoque ou produto não encontrado
    }
}
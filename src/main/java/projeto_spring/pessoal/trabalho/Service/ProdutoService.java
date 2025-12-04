package projeto_spring.pessoal.trabalho.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import projeto_spring.pessoal.trabalho.Repository.ProdutoRepository;
import projeto_spring.pessoal.trabalho.model.Produto;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public Produto obterProdutoDestaque() {
        return repository.buscarProdutoUnico();
    }

    public boolean processarCompra() {
        Produto produto = repository.buscarProdutoUnico();

        if (produto.getEstoque() > 0) {
            // Regra de negócio: Diminuir estoque
            repository.atualizarEstoque(produto.getEstoque() - 1);
            return true; // Compra aprovada
        }
        return false; // Sem estoque
    }
}

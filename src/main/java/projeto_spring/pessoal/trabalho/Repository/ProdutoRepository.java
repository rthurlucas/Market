package projeto_spring.pessoal.trabalho.Repository;

import org.springframework.stereotype.Repository;
import projeto_spring.pessoal.trabalho.model.Produto;

import java.util.HashMap;
import java.util.Map;

@Repository
public class ProdutoRepository {

    // Simulação de banco de dados (Map para simular produtos por ID)
    private Map<Long, Produto> catalogo = new HashMap<>();

    public ProdutoRepository() {
        // Inicializando 4 produtos diferentes para simular o catálogo de mercado
        catalogo.put(1L, new Produto(1L, "Fresh Berry", 12.90, 8, "#ff0066")); // Rosa
        catalogo.put(2L, new Produto(2L, "Eletric Blue", 14.50, 3, "#00ccff")); // Azul Claro
        catalogo.put(3L, new Produto(3L, "Green Boost", 11.90, 15, "#00ff88")); // Verde (Cor original)
        catalogo.put(4L, new Produto(4L, "Sun Citrus", 13.50, 0, "#ffdd00")); // Amarelo (Esgotado)
    }

    public Produto buscarProdutoPorId(Long id) {
        return catalogo.get(id);
    }

    public int totalProdutos() {
        return catalogo.size();
    }

    public void atualizarEstoque(Long id, int novoEstoque) {
        Produto produto = catalogo.get(id);
        if (produto != null) {
            produto.setEstoque(novoEstoque);
        }
    }
}
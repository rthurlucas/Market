package projeto_spring.pessoal.trabalho.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto_spring.pessoal.trabalho.Service.ProdutoService;
import projeto_spring.pessoal.trabalho.model.Produto;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Permite acesso do Front
public class LojaController {

    @Autowired
    private ProdutoService service;

    // NOVO ENDPOINT: Retorna o total de produtos para o front-end saber o limite da navegação
    @GetMapping("/total")
    public ResponseEntity<Integer> getTotalProdutos() {
        return ResponseEntity.ok(service.obterTotalProdutos());
    }

    // ENDPOINT ATUALIZADO: Agora aceita o ID do produto no path
    @GetMapping("/produto/{id}")
    public ResponseEntity<Produto> getProduto(@PathVariable Long id) {
        Produto produto = service.obterProdutoPorId(id);
        if (produto != null) {
            return ResponseEntity.ok(produto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ENDPOINT ATUALIZADO: Agora aceita o ID do produto no path
    @PostMapping("/comprar/{id}")
    public ResponseEntity<String> comprar(@PathVariable Long id) {
        boolean sucesso = service.processarCompra(id);

        if (sucesso) {
            // O Service já atualizou o objeto
            int estoqueRestante = service.obterProdutoPorId(id).getEstoque();
            return ResponseEntity.ok("Compra realizada! Estoque restante: " + estoqueRestante);
        } else {
            return ResponseEntity.status(400).body("Produto esgotado!");
        }
    }
}
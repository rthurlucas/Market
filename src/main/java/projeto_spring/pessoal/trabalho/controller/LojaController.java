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

    @GetMapping("/produto")
    public ResponseEntity<Produto> getProduto() {
        return ResponseEntity.ok(service.obterProdutoDestaque());
    }

    @PostMapping("/comprar")
    public ResponseEntity<String> comprar() {
        boolean sucesso = service.processarCompra();

        if (sucesso) {
            // O Service já atualizou o objeto, pegamos o valor novo para mostrar
            int estoqueRestante = service.obterProdutoDestaque().getEstoque();
            return ResponseEntity.ok("Compra realizada! Estoque restante: " + estoqueRestante);
        } else {
            return ResponseEntity.status(400).body("Produto esgotado!");
        }
    }
}

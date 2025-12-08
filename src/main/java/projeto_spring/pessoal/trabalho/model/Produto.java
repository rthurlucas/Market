package projeto_spring.pessoal.trabalho.model;

public class Produto {
    private Long id;
    private String nome;
    private double preco;
    private int estoque;
    // NOVO: Cor para o front-end 3D
    private String cor;

    // Construtor
    public Produto(Long id, String nome, double preco, int estoque, String cor) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.estoque = estoque;
        this.cor = cor;
    }

    // Getters e Setters (Necessários para o Java converter para JSON)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public double getPreco() { return preco; }
    public void setPreco(double preco) { this.preco = preco; }
    public int getEstoque() { return estoque; }
    public void setEstoque(int estoque) { this.estoque = estoque; }
    // NOVO: Getter para cor
    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }

}
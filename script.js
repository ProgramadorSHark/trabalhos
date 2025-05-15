/**
 * script.js
 *
 * Este arquivo contém os scripts JavaScript para o site de assistência técnica de computadores.
 */

(function() {
    'use strict';

    /**
     * Configuração do Formulário de Contato e Envio AJAX
     * -------------------------------------------------
     * Valida os campos e envia via Fetch API para o Formspree, esperando JSON.
     */
    function configurarFormularioContato() {
        const form = document.getElementById('form-contato');
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const mensagem = document.getElementById('mensagem');
        const mensagemStatus = document.getElementById('mensagem-status');

        if (!form) return;

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão SEMPRE
            let erros = [];

            // Limpa status anterior
            mensagemStatus.textContent = '';
            mensagemStatus.style.display = 'none';
            mensagemStatus.className = 'mensagem-status'; // Reseta classes

            // Validações
            if (!nome.value.trim()) {
                erros.push('O campo Nome é obrigatório.');
                if (!erros.length || erros.length === 1) nome.focus(); // Foca se for o primeiro erro
            }
            if (!email.value.trim()) {
                erros.push('O campo E-mail é obrigatório.');
                if (erros.length === 1) email.focus();
            } else if (!validarEmail(email.value.trim())) {
                erros.push('Por favor, insira um E-mail válido.');
                if (erros.length === 1) email.focus();
            }
            if (!telefone.value.trim()) {
                erros.push('O campo Telefone é obrigatório.');
                if (erros.length === 1) telefone.focus();
            }
            if (!mensagem.value.trim()) {
                erros.push('O campo Mensagem é obrigatória.');
                if (erros.length === 1) mensagem.focus();
            }

            if (erros.length > 0) {
                mensagemStatus.textContent = erros.join(' \n'); // Junta erros com nova linha para melhor leitura
                mensagemStatus.classList.add('erro');
                mensagemStatus.style.display = 'block';
            } else {
                // Enviar formulário via AJAX
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';

                fetch(form.action, { // Usa o action do form (seu endpoint Formspree)
                    method: 'POST',
                    body: new FormData(form),
                    headers: { // CORREÇÃO: Adicionado cabeçalho Accept para Formspree
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) { // Status 2xx indica sucesso para Formspree com AJAX
                        return response.json(); // CORREÇÃO: Processa a resposta JSON
                    } else {
                        // Se o Formspree retornar um erro, ele geralmente vem em JSON também
                        return response.json().then(data => { // CORREÇÃO: Processa o erro JSON
                            let errorMessage = `Falha no envio. Status: ${response.status}`;
                            if (data && data.errors && data.errors.length > 0) {
                                // Formspree pode retornar um array de erros
                                errorMessage = data.errors.map(err => err.message || err.field || err.error || 'Erro desconhecido no campo').join(', ');
                            } else if (data && data.error) { // Se Formspree mandar um único erro
                                errorMessage = data.error;
                            }
                            throw new Error(errorMessage);
                        });
                    }
                })
                .then(data => { // 'data' é o objeto JSON de sucesso do Formspree
                    mensagemStatus.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    mensagemStatus.classList.remove('erro'); // Garante que não tenha a classe erro
                    mensagemStatus.classList.add('sucesso');
                    mensagemStatus.style.display = 'block';
                    form.reset(); // Limpa o formulário
                })
                .catch(error => { // Erro de rede ou erro retornado pelo Formspree
                    mensagemStatus.textContent = `Erro ao enviar a mensagem: ${error.message}. Por favor, tente novamente ou contate-nos por telefone.`;
                    mensagemStatus.classList.remove('sucesso'); // Garante que não tenha a classe sucesso
                    mensagemStatus.classList.add('erro');
                    mensagemStatus.style.display = 'block';
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar Mensagem';
                });
            }
        });

        function validarEmail(email) {
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            return regex.test(email);
        }
    }

    /**
     * Rolagem Suave (Smooth Scrolling)
     * --------------------------------
     */
    function adicionarRolagemSuave() {
        const linksMenu = document.querySelectorAll('header nav ul li a[href^="#"]');

        linksMenu.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');

                if (href === '#') { // Link "Início" ou similar para o topo
                    event.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const alvoId = href.slice(1);
                    const alvoElemento = document.getElementById(alvoId);

                    if (alvoElemento) {
                        event.preventDefault();
                        alvoElemento.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    /**
     * Atualização Dinâmica do Ano no Rodapé
     * --------------------------------------
     */
    function atualizarAnoRodape() {
        const spanAno = document.getElementById('ano-atual-rodape');
        if (spanAno) {
            spanAno.textContent = new Date().getFullYear();
        }
    }

    /**
     * Inicialização
     * -------------
     */
    document.addEventListener('DOMContentLoaded', function() {
        configurarFormularioContato();
        adicionarRolagemSuave();
        atualizarAnoRodape();

        // Lógica para o menu mobile (hamburger)
        const mobileMenuButton = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('header nav ul');

        // CORREÇÃO: Verifica se os elementos existem antes de adicionar o listener
        if (mobileMenuButton && navMenu) {
            mobileMenuButton.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                // Opcional: Atualizar aria-expanded para acessibilidade
                const isExpanded = navMenu.classList.contains('active');
                mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            });
        }
    });

})();
/**
 * script.js - Fim
 *
 * Este arquivo contém os scripts JavaScript para o site de assistência técnica de computadores.
 */
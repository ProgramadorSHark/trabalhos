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
                if (!erros.length || erros.length === 1) nome.focus();
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
                mensagemStatus.textContent = erros.join(' \n');
                mensagemStatus.classList.add('erro');
                mensagemStatus.style.display = 'block';
            } else {
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';

                fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then(data => {
                            let errorMessage = `Falha no envio. Status: ${response.status}`;
                            if (data && data.errors && data.errors.length > 0) {
                                errorMessage = data.errors.map(err => err.message || err.field || err.error || 'Erro desconhecido').join(', ');
                            } else if (data && data.error) {
                                errorMessage = data.error;
                            }
                            throw new Error(errorMessage);
                        });
                    }
                })
                .then(data => {
                    mensagemStatus.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    mensagemStatus.classList.remove('erro');
                    mensagemStatus.classList.add('sucesso');
                    mensagemStatus.style.display = 'block';
                    form.reset();
                })
                .catch(error => {
                    mensagemStatus.textContent = `Erro ao enviar a mensagem: ${error.message}. Por favor, tente novamente.`;
                    mensagemStatus.classList.remove('sucesso');
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
     */
    function adicionarRolagemSuave() {
        const linksMenu = document.querySelectorAll('header nav ul li a[href^="#"]');
        linksMenu.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                if (href === '#') {
                    event.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const alvoId = href.slice(1);
                    const alvoElemento = document.getElementById(alvoId);
                    if (alvoElemento) {
                        event.preventDefault();
                        alvoElemento.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    /**
     * Atualização Dinâmica do Ano no Rodapé
     */
    function atualizarAnoRodape() {
        const spanAno = document.getElementById('ano-atual-rodape');
        if (spanAno) {
            spanAno.textContent = new Date().getFullYear();
        }
    }

    /**
     * Inicialização
     */
    document.addEventListener('DOMContentLoaded', function() {
        configurarFormularioContato();
        adicionarRolagemSuave();
        atualizarAnoRodape();

        // Lógica para o menu mobile (hamburger)
        const mobileMenuButton = document.getElementById('mobile-menu-toggle');
        // CORREÇÃO APLICADA: Seleciona a tag <nav> diretamente para aplicar a classe 'active'
        const navMenu = document.getElementById('main-navigation'); // Usa o ID da <nav>

        if (mobileMenuButton && navMenu) {
            mobileMenuButton.addEventListener('click', () => {
                navMenu.classList.toggle('active'); // Alterna a classe 'active' na TAG NAV
                
                // Adiciona/remove classe no header para controlar ícones do botão via CSS
                // Isso é útil se você quiser que o CSS mude os ícones com base em .header.menu-active
                const header = document.querySelector('header');
                const isExpanded = navMenu.classList.contains('active');
                
                if(header) { // Verifica se o header foi encontrado
                    header.classList.toggle('menu-active', isExpanded);
                }
                
                mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            });
        }
    });

})();

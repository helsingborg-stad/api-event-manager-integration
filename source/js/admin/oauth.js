export default (() => {
	var EventManagerIntegration = EventManagerIntegration || {};
	EventManagerIntegration.Admin = EventManagerIntegration.Admin || {};

	EventManagerIntegration.Admin.Oauth = (($) => {
		function Oauth() {
			$(
				function () {
					$('.oauth-access').addClass('hidden');
					this.handleEvents();
				}.bind(this),
			);
		}

		Oauth.prototype.requestOauth = (client, secret) => {
			$.ajax({
				url: eventintegration.ajaxurl,
				type: 'post',
				dataType: 'json',
				data: {
					action: 'request_oauth',
					client: client,
					secret: secret,
				},
				success: (response) => {
					if (response.success) {
						$('.error').addClass('hidden');
						$('.updated')
							.removeClass('hidden')
							.empty()
							.append('<p>' + response.data.message + '</p>');
						$('#oauth-access').before('<p>' + response.data.url + '</p>');
						$('.oauth-request').addClass('hidden');
						$('.oauth-access').removeClass('hidden');
					} else {
						$('.updated').addClass('hidden');
						$('.error')
							.removeClass('hidden')
							.empty()
							.append('<p>' + response.data + '</p>');
					}
				},
				error: (error) => {
					console.log(error);
				},
			});
		};

		Oauth.prototype.accessOauth = (verifier) => {
			$.ajax({
				url: eventintegration.ajaxurl,
				type: 'post',
				dataType: 'json',
				data: {
					action: 'access_oauth',
					verifier: verifier,
				},
				success: (response) => {
					if (response.success) {
						$('.error').addClass('hidden');
						location.reload();
					} else {
						$('.updated').addClass('hidden');
						$('.error')
							.removeClass('hidden')
							.empty()
							.append('<p>' + response.data + '</p>');
					}
				},
				error: (error) => {
					console.log(error);
				},
			});
		};

		Oauth.prototype.deleteOauth = () => {
			$.ajax({
				url: eventintegration.ajaxurl,
				type: 'post',
				data: {
					action: 'delete_oauth',
				},
				success: (response) => {
					console.log(response);
					location.reload();
				},
				error: (error) => {
					console.log(error);
				},
			});
		};

		/**
		 * Handle events
		 * @return {void}
		 */
		Oauth.prototype.handleEvents = function () {
			$('#oauth-request').submit(
				((e) => {
					e.preventDefault();
					var client = $('#client-key').val();
					var secret = $('#client-secret').val();
					Oauth.prototype.requestOauth(client, secret);
				}).bind(this),
			);

			$('#oauth-access').submit(
				((e) => {
					e.preventDefault();
					var verifier = $('#verification-token').val();
					console.log(verifier);
					Oauth.prototype.accessOauth(verifier);
				}).bind(this),
			);

			$('#oauth-authorized').submit(
				((e) => {
					e.preventDefault();
					Oauth.prototype.deleteOauth();
				}).bind(this),
			);
		};

		return new Oauth();
	})(jQuery);
})();

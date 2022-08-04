import React from "react";
import { SiTelegram, SiSkype } from "react-icons/si";
import { api, setToken, validateUsername } from "../utils/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth/auth-context";
import { useMutation } from "react-query";
import Loading from "react-fullscreen-loading";

const Login = () => {
	const { setUserData } = useAuth();

	const [showContact, setShowContact] = React.useState(false);

	let navigate = useNavigate();
	React.useEffect(() => {
		window.document.title = "login - isAlive ";
	}, []);

	const [passwordShown, setPasswordShown] = React.useState(false);

	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	const {
		mutate: login,
		isError,
		isLoading,
		error,
		reset,
	} = useMutation(async (data) => api.post("login", data), {
		onSuccess: (res) => {
			setToken(res.token);
			setUserData({ user: res.user, token: res.token });
			navigate("/");
		},
	});

	async function handleSubmit(event) {
		event.preventDefault();

		const { username, password } = event.target.elements;

		var go = true;
		if (username.value.length < 5) {
			username.classList.add("input-error");
			go = false;
		}

		if (password.value.length < 5) {
			password.classList.add("input-error");
			go = false;
		}

		if (go) {
			login({
				username: username.value,
				password: password.value,
			});
		}
	}

	return (
		<>
			{isLoading && (
				<Loading loading background="#f8f9fe" loaderColor="#dc3545" />
			)}
			<div className="limiter">
				<div className="container-login100">
					<div className="wrap-login100">
						<form
							className="login100-form validate-form"
							name="form"
							style={{
								backgroundImage: 'url("/assets/images/logo.png")',
								backgroundRepeat: "no-repeat",
								backgroundPosition: "50% 11%",
							}}
							onSubmit={handleSubmit}
							method="post"
							autoComplete="off"
						>
							<span className="login100-form-title p-b-34">Member Login</span>

							{isError && (
								<span
									id="error_msg"
									className="login100-form-title p-b-34"
									style={{
										fontSize: "12px",
										color: "#d40b0b",
										textTransform: "none",
									}}
								>
									{error.message}
								</span>
							)}
							<div
								className="wrap-input100 rs1-wrap-input100 validate-input m-b-20"
								data-validate="Type user name"
							>
								<input
									id="first-name"
									className="input100"
									type="text"
									autoComplete="off"
									name="username"
									placeholder="User name"
								/>
								<span className="focus-input100" />
							</div>
							<div
								className="wrap-input100 rs2-wrap-input100 validate-input m-b-20"
								data-validate="Type password"
							>
								<input
									className="input100"
									type="password"
									autoComplete="off"
									name="password"
									placeholder="Password"
								/>
								<span className="focus-input100" />
							</div>
							<div className="container-login100-form-btn">
								<button type="submit" className="login100-form-btn">
									Sign in
								</button>
							</div>
							<div
								className="w-full text-center"
								style={{ paddingTop: "27px" }}
							>
								<button
									onClick={() => setShowContact(!showContact)}
									type="button"
									className="txt3"
								>
									Request an account
								</button>
								<br />
								{showContact && (
									<div id="contact">
										<a
											title="Telegram"
											href="https://t.me/fg_anonyme"
											target="_blank"
										>
											<SiTelegram
												color="#469FE4"
												style={{
													width: "35px",
													height: "34px",
												}}
											/>
										</a>
										<a title="Skype" href="skype:a.xtn_1?chat" target="_blank">
											<SiSkype
												color="rgb(43 143 220)"
												style={{
													width: "35px",
													height: "34px",
												}}
											/>
										</a>
									</div>
								)}
							</div>
						</form>
						<div
							className="login100-more"
							style={{ backgroundImage: 'url("/assets/images/back.png")' }}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;

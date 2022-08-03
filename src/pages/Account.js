import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, getToken, isValidURL } from "../utils/utils";
import { useAuth } from "../context/auth/auth-context";

const Account = () => {
	const { user, logout } = useAuth();

	const [isCU, setIsCU] = React.useState(false);

	const [selectedHost, setSelectedHost] = React.useState(null);
	const [linksList, setLinksList] = React.useState("");

	const [ShowAddHosts, setShowAddHosts] = React.useState(false);

	const {
		data,
		refetch: hostnamesRefetch,
		isLoading,
	} = useQuery(
		`my-hostnames`,
		() =>
			api.get(`my-hostnames`, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			}),
		{
			onSuccess: (data) => {
				let listedLinks = JSON.parse(data.data[0].rlinks).join("\n");
				setSelectedHost(data.data[0].id);
				setLinksList(listedLinks);
			},
		}
	);

	const {
		data: tokenData,
		isError,
		refetch: generateToken,
	} = useQuery(
		`generate-token`,
		() =>
			api.get(`generate-token`, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			}),
		{
			onSuccess: (tokenData) => {
				setIsCU(true);
			},
			enabled: false,
		}
	);

	const { mutate: addHost } = useMutation(
		async (data) =>
			api.post("add-hostname", data, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			}),
		{
			onSuccess: (res) => {
				window.location.reload();
			},
		}
	);

	const { mutate: updateHost } = useMutation(
		async (data) =>
			api.post("update-hostname", data, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			}),
		{
			onSuccess: (res) => {
				window.location.reload();
			},
		}
	);

	const { mutate: removeHost } = useMutation(
		async (data) =>
			api.post("remove-hostname", data, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			}),
		{
			onSuccess: (res) => {
				window.location.reload();
			},
		}
	);

	function handleSelect(event) {
		event.preventDefault();

		const hostnamesData = data.data;

		const value = parseInt(event.target.value);

		let findedHost = hostnamesData.find((h) => h.id === value);

		setLinksList(JSON.parse(findedHost.rlinks).join("\n"));
		setSelectedHost(value);
	}

	async function removeHostname(event) {
		event.preventDefault();

		let hostID = selectedHost;

		removeHost({
			hostname_id: hostID,
		});
	}

	async function updateHostname(event) {
		event.preventDefault();

		let hostID = selectedHost;

		const { links } = event.target.elements;

		const linksList = links.value.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "");

		let error_list = false;

		let rlinks = linksList.split("\n").map((l) => {
			if (!isValidURL(l)) error_list = true;

			return l;
		});
		if (error_list) links.classList.add("input-error");

		if (!error_list) {
			updateHost({
				hostname_id: hostID,
				links: rlinks,
			});
		}
	}

	async function addHostname(event) {
		event.preventDefault();

		const { hostname, links } = event.target.elements;

		const linksList = links.value.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "");

		let error_host = false;
		let error_list = false;

		let rlinks = linksList.split("\n").map((l) => {
			if (!isValidURL(l)) error_list = true;

			return l;
		});

		if (!isValidURL(hostname.value)) error_host = true;

		if (error_host) hostname.classList.add("input-error");
		if (error_list) links.classList.add("input-error");

		if (!error_host && !error_list) {
			addHost({
				hostname: hostname.value,
				links: rlinks,
			});
		}
	}

	return (
		<>
			<div className="main-content">
				<div className="container mt-7">
					{/* Table */}
					<h2 className="mb-5">
						Welcome{" "}
						<i
							style={{
								textTransform: "capitalize",
								color: "#dc3545",
							}}
						>
							{user?.username}
						</i>
					</h2>
					<div className="row">
						<div className="col-xl-8 m-auto order-xl-1">
							<div className="card bg-secondary shadow">
								<div className="card-header bg-white border-0">
									<div className="row align-items-center">
										<div className="col-8">
											<h3 className="mb-0">My account</h3>
										</div>
										<div className="col-4 text-right">
											<a
												href={void 0}
												id="logout"
												className="btn btn-sm btn-primary"
												onClick={logout}
											>
												Logout
											</a>
										</div>
									</div>
								</div>
								<div className="card-body">
									<h6 className="heading-small text-muted mb-4">
										User information
									</h6>
									<div className="pl-lg-4">
										<div className="row">
											<div className="col-lg-6">
												<div className="form-group focused">
													<label
														className="form-control-label"
														htmlFor="input-username"
													>
														Username
													</label>
													<input
														type="text"
														id="input-username"
														className="form-control form-control-alternative"
														placeholder="Username"
														defaultValue={
															user?.username
														}
														readOnly
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12">
												<div className="form-group focused">
													<label
														className="form-control-label"
														htmlFor="input-address"
													>
														Token
													</label>
													<input
														id="input-token"
														className="form-control form-control-alternative"
														placeholder="token"
														defaultValue={
															isCU
																? tokenData?.uuid
																: user?.uuid
														}
														type="text"
														readOnly
														style={{
															backgroundColor:
																"white",
														}}
													/>
													<a
														id="copy"
														data-copy="<%= data.user_info.token %>"
														title="copy token"
													>
														{" "}
														<p
															id="cpmsg"
															style={{
																display: "none",
																float: "right",
															}}
														>
															copied
														</p>
													</a>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-12">
												<div className="form-group focused">
													<label
														className="form-control-label"
														htmlFor="input-address"
													>
														<a
															id="generate"
															className="btn btn-sm btn-secondary text-white"
															onClick={
																generateToken
															}
														>
															Generate another
															Token
														</a>
													</label>
												</div>
											</div>
										</div>
										<hr className="my-4" />
										<div className="row">
											<div className="col-md-12">
												<div className="form-group focused">
													<label
														className="form-control-label"
														htmlFor="input-address"
														style={{
															marginRight: "14px",
														}}
													>
														Add Hostname{" "}
														<i>
															(website you use to
															do the redirection)
														</i>
													</label>
													<span className="input-group-btn">
														<button
															type="button"
															className="btn btn-success btn-number"
															value="+"
															style={{
																fontSize:
																	"13px",
																backgroundColor:
																	"#28a745bd !important",
															}}
															onClick={() =>
																setShowAddHosts(
																	!ShowAddHosts
																)
															}
														>
															<span className="input-group-btn">
																<span className="input-group-btn">
																	+
																</span>
															</span>
														</button>
													</span>
												</div>
											</div>
										</div>
										<div
											id="showed"
											style={{
												display: ShowAddHosts
													? "block"
													: "none",
											}}
										>
											<form
												name="magico"
												id="magico"
												method="post"
												autoComplete="off"
												onSubmit={addHostname}
											>
												<div className="row">
													<div className="col-lg-6">
														<div className="form-group focused">
															<label
																className="form-control-label"
																htmlFor="input-username"
															>
																Hostname
															</label>
															<input
																type="text"
																id="hostname"
																autoComplete="off"
																name="hostname"
																className="form-control form-control-alternative"
																placeholder="hostname used to redirect"
															/>
														</div>
													</div>
													<div className="col-lg-6">
														<div className="form-group">
															<label
																className="form-control-label"
																htmlFor="input-email"
															>
																Scampage Links
															</label>
															<textarea
																rows={6}
																id="links"
																name="links"
																className="form-control form-control-alternative"
																placeholder="scampages links related to the hostname you entred"
																defaultValue={
																	""
																}
															/>
														</div>
														<button
															id="mag"
															name="add-more"
															className="btn btn-danger"
															type="submit"
															style={{
																float: "right",
																marginBottom:
																	"5%",
																marginTop: "5%",
															}}
														>
															Add Hostname
														</button>
													</div>
												</div>
											</form>
										</div>
									</div>
									{/* Address */}
									{/* Description */}
									<hr className="my-4" />
									<div className="row">
										<div className="col-md-12">
											<div className="form-group focused">
												<label
													className="form-control-label"
													htmlFor="input-address"
													style={{
														marginRight: "14px",
													}}
												>
													You have{" "}
													<font
														className="text-info"
														style={{
															fontSize: "16px",
														}}
													>
														{data?.data.length}
													</font>{" "}
													Linked Hostnames
												</label>
											</div>
										</div>
									</div>
									{/* start IF */}

									<form
										name="linksHost"
										method="post"
										autoComplete="off"
										onSubmit={updateHostname}
									>
										<div>
											<div className="row">
												<div className="col-lg-6">
													<div className="form-group focused">
														<label
															className="form-control-label"
															htmlFor="input-username"
														>
															Hostnames
														</label>
														<select
															id="current_hosts"
															name="host"
															className="form-control"
															onChange={
																handleSelect
															}
														>
															{data?.data
																.length ===
																0 && (
																<option
																	data-id
																	defaultValue="1"
																>
																	select
																	hostname
																</option>
															)}
															{/* start map */}
															{data?.data &&
																data?.data.map(
																	(
																		host,
																		index
																	) => (
																		<option
																			key={
																				index
																			}
																			value={
																				host?.id
																			}
																			data-id={
																				host?.rlinks
																			}
																		>
																			{
																				host?.host
																			}
																		</option>
																	)
																)}
															{/* end map */}
														</select>
													</div>
												</div>
												<div className="col-lg-6">
													<div className="form-group">
														<label
															className="form-control-label"
															htmlFor="input-email"
														>
															Scampages Links
														</label>
														<textarea
															rows={6}
															id="links_cc"
															name="links"
															className="form-control form-control-alternative"
															placeholder="scampages links related to the hostname"
															defaultValue={
																linksList
															}
														/>
													</div>
													<button
														style={{
															float: "right",
															marginBottom: "5%",
															marginTop: "5%",
															marginLeft: "3%",
														}}
														type="submit"
														className="btn btn-info"
														name="action"
														data-action="update"
														id="upbtn"
													>
														Update Links
													</button>
													<button
														id="rmbtn"
														type="button"
														data-action="delete"
														className="btn btn-danger"
														onClick={(e) =>
															removeHostname(e)
														}
														style={{
															float: "right",
															marginBottom: "5%",
															marginTop: "5%",
														}}
													>
														Remove Hostname
													</button>
												</div>
											</div>
										</div>
									</form>
									{/* end if */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className="footer">
				<div className="row align-items-center justify-content-xl-between">
					<div className="col-xl-6 m-auto text-center">
						<div className="copyright">
							<p>
								Made By{" "}
								<a href="#" title="FGanonyme">
									FGanonyme
								</a>{" "}
								© 2022
							</p>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};

export default Account;

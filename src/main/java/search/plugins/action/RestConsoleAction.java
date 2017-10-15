/*
 * Licensed to es-sp-tools under one or more contributor
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *      http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

package search.plugins.action;

import java.io.File;
import java.io.IOException;

import org.elasticsearch.client.node.NodeClient;
import org.elasticsearch.common.settings.ClusterSettings;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.settings.SettingsFilter;
import org.elasticsearch.rest.BaseRestHandler;
import org.elasticsearch.rest.BytesRestResponse;
import org.elasticsearch.rest.RestController;
import org.elasticsearch.rest.RestRequest;
import org.elasticsearch.rest.RestRequest.Method;
import org.elasticsearch.rest.RestStatus;

import search.plugins.common.Common;

public class RestConsoleAction extends BaseRestHandler {

	public void log(int level, Object o) {
		if (level > Common.logLevel) {
			Common.log0(o);
		}
	}

	// {client.type=node, cluster.name=my-local, http.cors.allow-credentials=true, http.cors.allow-origin=/.*/, http.cors.enabled=true,
	// http.type.default=netty4, network.host=0.0.0.0, node.name=Ve_y1qO, path.home=D:\_workspace\ws005\es5test\target\classes,
	// path.logs=D:\_workspace\ws005\es5test\target\classes\logs, transport.type.default=netty4}
	String getPath = null;

	public RestConsoleAction(Settings settings, RestController controller, ClusterSettings clusterSettings, SettingsFilter settingsFilter) {
		super(settings);
		// TODO Auto-generated constructor stub
		controller.registerHandler(Method.GET, "/_console", this);
		controller.registerHandler(Method.GET, "/_console/{action}", this);

		String path = Common.getPathResources(settings);
		this.getPath = path;
		log(9, path);

	}

	@Override
	protected RestChannelConsumer prepareRequest(RestRequest request, NodeClient client) throws IOException {
		// final String func = request.hasParam("func") ? request.param("func") : "con";
		// final String funcAction = request.hasParam("action") ? request.param("action") : "jquery.js";

		final String action = request.hasParam("action") ? request.param("action") : "show";

		RestChannelConsumer rr = null;

		if ("show".equals(action)) {
			rr = returnConsloe(request, client);
		} else {

			if (action.endsWith("js") || action.endsWith("css")) {
				rr = returnRs(request, client, action);
			}

		}

		return rr;
	}

	private RestChannelConsumer returnRs(RestRequest request, NodeClient client, String funcAction) {
		String htmlType = "text/css";

		if (funcAction.endsWith(".js")) {
			htmlType = "application/x-javascript";
			funcAction = funcAction.replace(".js", ".comp.js");
		}

		String path = getPath + "_console/" + funcAction;
		String type = htmlType;

		byte[] rs = Common.readFile(new File(path));

		if (rs == null) {
			log(10, "returnRs not found ! " + path);
		}


		RestChannelConsumer rr = channel -> {
			// RestRequest r = channel.request();

			// byte[] rs = Common.readFile(new File(path));

			// image/jpeg
			//
			if (rs == null) {
				channel.sendResponse(new BytesRestResponse(RestStatus.NOT_FOUND, type, path + " not found!"));
			} else {
				channel.sendResponse(new BytesRestResponse(RestStatus.OK, type, rs));
			}
		};
		return rr;

	}

	private RestChannelConsumer returnConsloe(RestRequest request, NodeClient client) {
		RestChannelConsumer rr = channel -> {
			// RestRequest r = channel.request();

			byte[] rs = Common.readFile(new File(getPath + "console.pub.html"));

			channel.sendResponse(new BytesRestResponse(RestStatus.OK, "text/html; charset=UTF-8", rs));
		};
		return rr;
	}

}

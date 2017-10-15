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
package search.plugins.common;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

import org.elasticsearch.common.settings.Settings;

public class Common {
	
	//TODO
	public final static int logLevel = 0;
	
	//
	public final static void log0(Object o){
		System.out.println(o.toString());
	}

	public static void log(int level, Object o) {
		if (level > Common.logLevel) {
			Common.log0(o);
		}
	}

	public static String getPathResources(Settings settings) {
		String sep = "/";
		String path = settings.get("path.home");
		String pluginPath = settings.get("sp.tools.path.name", "sp-tools");
		path += sep + "plugins";
		path += sep + pluginPath;
		path += sep + "resources";
		path += sep;
		return path;
	}

	public static String getPath(Settings settings) {
		String sep = "/";
		String path = settings.get("path.home");
		String pluginPath = settings.get("sp.tools.path.name", "sp-tools");
		path += sep + "plugins";
		path += sep + pluginPath;
		path += sep;
		return path;
	}

	public static byte[] readFile(File f) {
		if (!f.exists()) {
			return null;
		}
		int filelength = (int) f.length();
		log(1, filelength);

		byte[] r = new byte[filelength];

		try (BufferedInputStream in = new BufferedInputStream(new FileInputStream(f))) {
			in.read(r);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return r;
	}

	public static Properties loadPropertiesfile(String filePath) {
		Properties properties = new Properties();
		try {
			//properties.load(Thread.currentThread().getContextClassLoader().getResourceAsStream(filePath));
			FileReader fr = new FileReader(new File(filePath));
			properties.load(fr);
		} catch (IOException e) {
			log(10, "The properties file is not loaded.\r\n" + e);
			throw new IllegalArgumentException("The properties file is not loaded.\r\n" + e);
		}

		return properties;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}

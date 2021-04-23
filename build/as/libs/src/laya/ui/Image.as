package laya.ui {
	import laya.resource.Texture;
	import laya.resource.Texture;
	import laya.ui.UIComponent;

	/**
	 * 资源加载完成后调度。
	 * @eventType Event.LOADED
	 */

	/**
	 * <code>Image</code> 类是用于表示位图图像或绘制图形的显示对象。
	 * Image和Clip组件是唯一支持异步加载的两个组件，比如img.skin = "abc/xxx.png"，其他UI组件均不支持异步加载。
	 * @example <caption>以下示例代码，创建了一个新的 <code>Image</code> 实例，设置了它的皮肤、位置信息，并添加到舞台上。</caption>
	 * @example Laya.init(640, 800);//设置游戏画布宽高
	 * @example class Image_Example {
	 * @see laya.ui.AutoBitmap
	 */
	public class Image extends UIComponent {

		/**
		 * @private 
		 */
		protected var _skin:String;

		/**
		 * @private 
		 */
		protected var _group:String;

		/**
		 * 创建一个 <code>Image</code> 实例。
		 * @param skin 皮肤资源地址。
		 */

		public function Image(skin:String = undefined){}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override public function destroy(destroyChild:Boolean = null):void{}

		/**
		 * 销毁对象并释放加载的皮肤资源。
		 */
		public function dispose():void{}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override protected function createChildren():void{}

		/**
		 * <p>对象的皮肤地址，以字符串表示。</p>
		 * <p>如果资源未加载，则先加载资源，加载完成后应用于此对象。</p>
		 * <b>注意：</b>资源加载完成后，会自动缓存至资源库中。
		 */
		public function get skin():String{return null;}
		public function set skin(value:String):void{}

		/**
		 * @copy laya.ui.AutoBitmap#source
		 */
		public function get source():Texture{return null;}
		public function set source(value:Texture):void{}

		/**
		 * 资源分组。
		 */
		public function get group():String{return null;}
		public function set group(value:String):void{}

		/**
		 * @private 设置皮肤资源。
		 */
		protected function setSource(url:String,img:* = null):void{}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override protected function measureWidth():Number{
			return null;
		}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override protected function measureHeight():Number{
			return null;
		}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override public function set width(value:Number):void{}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override public function get width():Number{return null;}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override public function set height(value:Number):void{}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override public function get height():Number{return null;}

		/**
		 * <p>当前实例的位图 <code>AutoImage</code> 实例的有效缩放网格数据。</p>
		 * <p>数据格式："上边距,右边距,下边距,左边距,是否重复填充(值为0：不重复填充，1：重复填充)"，以逗号分隔。
		 * <ul><li>例如："4,4,4,4,1"。</li></ul></p>
		 * @see laya.ui.AutoBitmap#sizeGrid
		 */
		public function get sizeGrid():String{return null;}
		public function set sizeGrid(value:String):void{}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override public function set dataSource(value:*):void{}

		/**
		 * @inheritDoc 
		 * @override 
		 */
		override public function get dataSource():*{return null;}
	}

}